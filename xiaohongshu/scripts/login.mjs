#!/usr/bin/env node
/**
 * 一键保存小红书登录 Cookie
 *
 * 小红书网页版现在对匿名访客全站 302 到登录页，抓频道数据必须带 Cookie。
 * 本脚本把浏览器里的 Cookie 校验一遍后存到 .xhs-cookie（已 gitignore，不会提交）。
 *
 * 用法（任选一种）：
 *   npm run login                  # 直接读系统剪贴板（在浏览器里复制好 Cookie 再执行）
 *   npm run login -- "a1=..; web_session=.."
 *   XHS_COOKIE="a1=..; web_session=.." npm run login
 *   npm run login -- --check       # 只校验当前已保存的 Cookie 是否还有效
 *   npm run login -- --show        # 打印当前 Cookie 摘要（脱敏）
 *   npm run login -- --clear       # 删除已保存的 Cookie
 *
 * 怎么拿到 Cookie（30 秒）：
 *   1. Chrome/Safari 打开 https://www.xiaohongshu.com/explore 并确认已登录；
 *   2. 按 F12 打开开发者工具 → Network 面板 → 刷新页面；
 *   3. 点最上面那条对 www.xiaohongshu.com/explore 的请求 →
 *      Headers → Request Headers → 找到 `cookie:`，整行值复制下来；
 *   4. 回到终端执行 `npm run login`（macOS 会自动读剪贴板）。
 */
import fs from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { COOKIE_FILE, EXPLORE_URL, channelUrl, probe, resolveCookie, sleep } from './xhs-client.mjs'

const execFileAsync = promisify(execFile)

/** 从系统剪贴板读文本（macOS 用 pbpaste） */
async function readClipboard() {
  const cmds = [
    ['pbpaste', []],
    ['xclip', ['-selection', 'clipboard', '-o']],
    ['wl-paste', ['--no-newline']],
  ]
  for (const [cmd, args] of cmds) {
    try {
      const { stdout } = await execFileAsync(cmd, args, { maxBuffer: 1024 * 1024 })
      if (stdout.trim()) return stdout.trim()
    } catch {
      /* 换下一个 */
    }
  }
  return ''
}

/** 规范化 Cookie：允许只粘贴 web_session 的值 */
function normalizeCookie(input) {
  let s = String(input).trim().replace(/^cookie:\s*/i, '')
  // 去掉换行/多余空格
  s = s.replace(/\s*\n\s*/g, ' ').replace(/;\s*/g, '; ').replace(/\s+/g, ' ').trim()
  // 没有 = 号说明只给了 web_session 的值
  if (s && !s.includes('=')) s = `web_session=${s}`
  return s
}

/** 脱敏摘要 */
function mask(cookie) {
  const parts = cookie.split('; ').filter(Boolean)
  const keep = ['a1', 'web_session', 'webId', 'gid', 'xsecappid', 'abRequestId']
  return parts
    .map((p) => {
      const i = p.indexOf('=')
      const k = i < 0 ? p : p.slice(0, i)
      const v = i < 0 ? '' : p.slice(i + 1)
      if (!keep.includes(k)) return null
      const shown = v.length > 8 ? `${v.slice(0, 4)}…${v.slice(-4)}` : '…'
      return `${k}=${shown}`
    })
    .filter(Boolean)
    .join('  ')
}

async function checkSaved() {
  const { cookie, from } = await resolveCookie()
  if (!cookie) {
    console.log('还没有保存过 Cookie。执行 `npm run login` 从剪贴板读取。')
    return false
  }
  console.log(`Cookie 来源：${from}`)
  console.log(`Cookie 摘要：${mask(cookie) || '(未识别到常见字段)'}`)
  console.log('正在校验……')
  const home = await probe(EXPLORE_URL, cookie)
  if (!home.ok) {
    console.log(`✗ 不可用：HTTP ${home.status}${home.location ? ` -> ${home.location}` : ''}`)
    console.log('  Cookie 可能已过期，重新登录小红书后再复制一次。')
    return false
  }
  console.log(`✓ 登录态有效：探索页 HTTP ${home.status}，读到 ${home.categories.length} 个频道`)
  return true
}

async function main() {
  const argv = process.argv.slice(2)
  if (argv.includes('--clear')) {
    await fs.rm(COOKIE_FILE, { force: true })
    console.log('已删除 .xhs-cookie')
    return
  }
  if (argv.includes('--show') || argv.includes('--check')) {
    await checkSaved()
    return
  }

  // 取值：参数 > 环境变量 > 剪贴板
  let raw = ''
  let source = ''
  const argIdx = argv.findIndex((a) => a === '--cookie')
  if (argIdx >= 0 && argv[argIdx + 1]) {
    raw = argv[argIdx + 1]
    source = '命令行参数'
  } else if (process.env.XHS_COOKIE) {
    raw = process.env.XHS_COOKIE
    source = 'XHS_COOKIE 环境变量'
  } else {
    const nonFlag = argv.find((a) => !a.startsWith('--'))
    if (nonFlag) {
      raw = nonFlag
      source = '命令行参数'
    } else {
      raw = await readClipboard()
      source = '系统剪贴板'
    }
  }

  if (!raw) {
    console.error('没读到 Cookie。')
    console.error('请先在浏览器里复制 cookie 整行，然后执行：npm run login')
    console.error('或者手动传入：npm run login -- "a1=...; web_session=..."')
    process.exit(1)
  }

  const cookie = normalizeCookie(raw)
  console.log(`从${source}读到 Cookie（${cookie.length} 字符）`)
  console.log(`摘要：${mask(cookie) || '(未识别到常见字段)'}`)

  if (!/web_session=/.test(cookie)) {
    console.warn('⚠ 没看到 web_session 字段，多半不是完整 Cookie。')
    console.warn('  请复制 Request Headers 里 cookie 那一整行的值（应包含 a1、web_session 等）。')
  }

  console.log('正在校验登录态……')
  const home = await probe(EXPLORE_URL, cookie)
  if (!home.ok) {
    console.error(`✗ 校验失败：HTTP ${home.status}${home.location ? ` -> ${home.location}` : ''}`)
    console.error('  Cookie 可能不完整或已过期。请重新登录小红书网页版后重新复制。')
    process.exit(1)
  }
  console.log(`✓ 探索页 OK（HTTP ${home.status}，${home.categories.length} 个频道）`)

  // 再试一个频道，确认频道页也通
  const ch = home.categories.find((c) => c.id && c.name !== '推荐')
  if (ch) {
    await sleep(800)
    const r = await probe(channelUrl(ch.id), cookie)
    if (r.ok) {
      const n = ((r.state.feed && r.state.feed.feeds) || []).length
      console.log(`✓ 频道页 OK：「${ch.name}」${ch.id} 返回 ${n} 条`)
    } else {
      console.warn(`⚠ 频道页仍不可用（HTTP ${r.status}）：${ch.name} ${ch.id}`)
    }
  }

  await fs.writeFile(COOKIE_FILE, cookie, { mode: 0o600 })
  console.log(`\n已保存到 ${COOKIE_FILE}（权限 600，已在 .gitignore 忽略）`)
  console.log('接下来执行：npm run fetch:notes')
}

main().catch((e) => {
  console.error('执行异常：', e)
  process.exit(1)
})
