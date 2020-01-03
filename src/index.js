import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import ToastRcm from './toastRcm';
import './index.less';

class Toaster extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string, // 自定义类名前缀
    type: PropTypes.string, // success / error
    onClose: PropTypes.func, // 关闭回调
    duration: PropTypes.number // 默认3s
  };

  static defaultProps = {
    prefixCls: 'aclink-toast'
  };

  state = {
    notice: {}
  };

  // 属性传进来
  add = notice => this.setState(preState => ({ notice }));

  // 移除toast时置空
  remove = () => this.setState({ notice: {} });

  render() {
    const { notice } = this.state;
    const props = this.props;
    const className = {
      [props.prefixCls]: 1,
      [props.className]: !!props.className,
      [`${props.prefixCls}-success`]: notice.type === 'success',
      [`${props.prefixCls}-error`]: notice.type === 'error'
    };

    const onClose = createChainedFunction(
      this.remove.bind(this),
      notice.onCloseBack
    );

    return (
      <div className={classnames(className)}>
        {notice.content && (
          <ToastRcm prefixCls={props.prefixCls} {...notice} onClose={onClose}>
            {notice.content}
          </ToastRcm>
        )}
      </div>
    );
  }
}

function createChainedFunction() {
  var args = [].slice.call(arguments, 0);

  if (args.length === 1) {
    return args[0];
  }

  return function chainedFunction() {
    for (var i = 0; i < args.length; i++) {
      if (args[i] && args[i].apply) {
        args[i].apply(this, arguments);
      }
    }
  };
}

Toaster.createToast = function(properties, callback) {
  const { getContainer, ...props } = properties || {};
  let div = document.createElement('div');

  // 指定挂载或直接在body下
  if (getContainer) {
    const root = getContainer();
    root.appendChild(div);
  } else {
    document.body.appendChild(div);
  }

  let called = false;
  function ref(toaster) {
    if (called) return;
    called = true;
    // console.log('props', props);
    // toaster.add(props,callback);
    callback({
      toast(toastProps) {
        // console.log('add');
        toaster.add(toastProps);
      },
      component: toaster,
      destroy() {
        ReactDOM.unmountComponentAtNode(div);
        div.parentNode.removeChild(div);
      }
    });
  }

  ReactDOM.render(<Toaster {...props} ref={ref} />, div);
};

export default {
  success(properties) {
    const toastConfig = this._getConfig(properties) || {};
    this._text({ type: 'success', ...toastConfig });
  },
  fail(properties) {
    const toastConfig = this._getConfig(properties) || {};
    this._text({ type: 'error', ...toastConfig });
  },
  _getConfig(properties) {
    let toastConfig = {};
    if (typeof properties === 'string') {
      toastConfig.content = properties;
    } else if (
      Object.prototype.toString.call(properties) === '[object Object]'
    ) {
      toastConfig = Object.assign({}, properties);
    } else {
      throw new TypeError(
        'The parameter is incorrect, requiring a string or object'
      );
    }
    return toastConfig;
  },
  _text(properties) {
    return Toaster.createToast({}, toaster => {
      const { onClose, ...props } = properties;
      toaster.toast({
        type: 'success', // 默认成功
        ...props,
        onCloseBack: () => {
          if (onClose) {
            onClose();
          }
          toaster.destroy();
        }
      });
    });
  }
};
