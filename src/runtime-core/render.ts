import { isObject } from '../shared/index'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
  // 这里的 render 调用 patch 方法，方便对于子节点进行递归处理
  patch(vnode, container)
}

export function patch(vnode, container) {
  // 去处理组件，在脑图中我们可以第一步是先判断 vnode 的类型
  // 如果是 element 就去处理 element 的逻辑
  const { shapeFlags } = vnode
  if (shapeFlags & ShapeFlags.ELEMENT) {
    processElement(vnode, container)
  } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container)
  }
}

function processElement(vnode, container) {
  // 分为 init 和 update 两种，这里先写 init
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  // 此函数就是用来将 vnode -> domEl 的
  const { type: domElType, props, children, shapeFlags } = vnode
  // 创建 dom
  const domEl = (vnode.el = document.createElement(domElType))
  // 加入 attribute
  const isOn = (key: string) => /^on[A-Z]/.test(key)
  for (const prop in props) {
    if (isOn(prop)) {
      const event = prop.slice(2).toLowerCase()
      domEl.addEventListener(event, props[prop])
    } else {
      domEl.setAttribute(prop, props[prop])
    }
  }
  // 这里需要判断children两种情况，string or array
  if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
    domEl.textContent = children
  } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, domEl)
  }
  // 最后将 domEl 加入 dom 树中
  container.appendChild(domEl)
}

function mountChildren(vnode, container) {
  vnode.children.forEach(vnode => {
    patch(vnode, container)
  })
}

export function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
  // 通过 vnode 获取组件实例
  const instance = createComponentInstance(vnode)
  // setup component
  setupComponent(instance)
  // setupRenderEffect
  setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance, vnode, container) {
  const subTree = instance.render.call(instance.proxy)
  patch(subTree, container)
  vnode.el = subTree.el
}
