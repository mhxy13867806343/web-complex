/**
 * React 19 去掉了 findDOMNode，createRoot 又在 react-dom/client。
 * NutUI 仍从 `react-dom` 上读取这两个函数。
 * 这里不能直接 import client，否则和 react-dom 循环依赖，createRoot 会是空的。
 */
export * from 'react-dom-original'
import * as ReactDOM from 'react-dom-original'

type AnyFn = (...args: any[]) => any

const ROOT_KEY = '__xhsReactCreateRoot'
const HYDRATE_KEY = '__xhsReactHydrateRoot'

export function installReactDomClient(api: { createRoot: AnyFn; hydrateRoot: AnyFn }) {
  ;(globalThis as any)[ROOT_KEY] = api.createRoot
  ;(globalThis as any)[HYDRATE_KEY] = api.hydrateRoot
}

export function createRoot(...args: any[]) {
  const fn = (globalThis as any)[ROOT_KEY] as AnyFn | undefined
  if (!fn) throw new Error('createRoot 尚未就绪')
  return fn(...args)
}

export function hydrateRoot(...args: any[]) {
  const fn = (globalThis as any)[HYDRATE_KEY] as AnyFn | undefined
  if (!fn) throw new Error('hydrateRoot 尚未就绪')
  return fn(...args)
}

export function findDOMNode(componentOrElement: unknown): Element | Text | null {
  if (componentOrElement == null) return null
  if (
    typeof componentOrElement === 'object' &&
    'nodeType' in componentOrElement &&
    ((componentOrElement as Node).nodeType === 1 || (componentOrElement as Node).nodeType === 3)
  ) {
    return componentOrElement as Element | Text
  }
  const fiber = (componentOrElement as { _reactInternals?: { child?: unknown; stateNode?: unknown } })
    ._reactInternals
  let node = fiber
  while (node) {
    const stateNode = node.stateNode
    if (
      stateNode &&
      typeof stateNode === 'object' &&
      'nodeType' in stateNode &&
      ((stateNode as Node).nodeType === 1 || (stateNode as Node).nodeType === 3)
    ) {
      return stateNode as Element | Text
    }
    node = node.child as typeof node
  }
  return null
}

const shim = Object.assign({}, ReactDOM, { findDOMNode, createRoot, hydrateRoot })
export default shim
