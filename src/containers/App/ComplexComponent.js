import { Component } from 'react';
import { fromJS, is } from 'immutable';

/**
 *  复杂组件需要继承此方法，代理shouldComponentUpdate生命周期
 *  比较props是否相同，通过immutableJS的is方法比较两个Map的hashCode是否相同，避免深度比较
 *  简单组件，简单props组件尽量不要使用本方法；之前使用PureComponent或手写字段比较即可
 */
export default class ComplexComponent extends Component {
  shouldComponentUpdate(nextProps = {}, nextState = {}) {
    // 函数对undefined会赋默认值，null不会，当为null时需特殊处理
    /* eslint-disable */
    nextProps = nextProps === null ? {} : nextProps;
    nextState = nextState === null ? {} : nextState;
    /* eslint-enable */
    const thisProps = this.props || {};
    const thisState = this.state || {};

    if (
      Object.keys(thisProps).length !== Object.keys(nextProps).length
      || Object.keys(thisState).length !== Object.keys(nextState).length
    ) {
      return true;
    }

    // thisProps 和 nextProps初始为原生对象，需要使用fromJS转化为list/map对象，再比较
    for (const key in nextProps) {
      if (!is(fromJS(thisProps[key]), fromJS(nextProps[key]))) {
        return true;
      }
    }

    for (const key in nextState) {
      if (
        thisState[key] !== nextState[key]
        && !is(fromJS(thisState[key]), fromJS(nextState[key]))
      ) {
        return true;
      }
    }
    return false;
  }
}
