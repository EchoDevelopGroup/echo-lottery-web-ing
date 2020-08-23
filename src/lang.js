export const zhCN = {
  // 没有设置自动登录、进入页面时 要求用户输入用户名密码的提示
  inputLoginTips:
    '欢迎回来，黑桃影大小姐，请在下方的输入框输入您的用户名和密码以登录',
  // 进入页面时 提示可以调整界面大小的提示
  scaleScreenTips: '如果界面大小不合适，可以按住"Ctrl"+"滚轮"调整大小哦',
  // 登录成功后的提示
  loginSuccessTips: '登录成功！欢迎回来，黑桃影大小姐',
  // 登录失败时的提示
  loginFailedTips: err => `登录失败: ${err.message}`,
  // 点击开始按钮后的提示1
  pressStartTips1: (attendKeyword, medalLevel) =>
    `只抓弹幕发送"${attendKeyword}"并且粉丝等级在${medalLevel}级或以上的人`,
  // 点击开始按钮后的提示2
  pressStartTips2: '正在准备从弹幕中抓人',
  // 点击开始按钮后的提示2
  pressStartTips3: '已经开始抓人',
  // 触发启动失败时报错
  startFailedTips: err => `启动捕捉失败了，原因是: ${err.message}`,
  // 点击结束按钮后的提示1
  pressStopTips1: '正在结束抓人',
  // 点击结束按钮后的提示2
  pressStopTips2: '结束成功',
  // 触发结束失败时报错
  stopFailedTips: err => `结束捕捉失败了，原因是: ${err.message}`,
  // 显示名单失败时的报错
  loadMembersFailedTips: err =>
    `没能成功读取参与名单，原因是: ${err.message}，自动重试`,
  // 前一轮鲨人没有结束 用户就再次点击鲨人按钮时的提示
  repeatExecutingTips: '大小姐，前一轮还没鲨完，稍等一下哦？',
  // 还没点击结束按钮 也就是没有停止抓人的情况下 用户就点击鲨人按钮时的提示
  executingBeforeStopTips: '大小姐，还没有停止抓人，不能开始鲨人哦？',
  // 虽然处于停止状态 但是抓到的人数不足 就点鲨人按钮时的提示
  executingBeforeEnoughMembersTips:
    '大小姐，现在抓到的人还太少，不能开始鲨人哦？要先抓够数了再鲨。',
  // 鲨人操作失败提示 对应点击左侧的一次鲨到底
  executeThroughFailedTips: err => `鲨人(一次性)失败，原因是: ${err.message}`,
  // 鲨人操作失败提示 对应点击右侧的鲨一半
  executeHalfFailedTips: err => `鲨人(一半)失败，原因是: ${err.message}`
}
