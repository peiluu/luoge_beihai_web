const isDev = process.env.NODE_ENV === 'development';
let host = process.env.VUE_APP_BUSINESSURL;
let hostUser = process.env.VUE_APP_APIURL;
/**
 * 本地开发环境与后端各小伙伴本地联调，无需在env.development中修改
 */
if (isDev) {
   //host = 'http://192.168.1.25:8003/mtclq-mtclqback'; // 博鑫
   //host = 'http://192.168.1.80:8003/mtclq-mtclqback'; // 杨聪
   //hostUser = 'http://192.168.1.80:8002/mtcAuth';
  // host = 'http://192.168.1.74:8003/mtclq-mtclqback'; // 陈阳
  // host = 'http://192.168.1.26:8003/mtclq-mtclqback'; // 李尚恒
  // host = 'http://192.168.1.80:8003/mtclq-mtclqback'; // 邓伟林
  //  host = 'http://192.168.1.117:8003/mtclq-mtclqback'; // 令狐芷冉

}
export const config = {
  /*应用名称*/
  title: '罗格北海',
  /*是否使用页签*/
  useTab: true,
  /*是否添加页面加载动画*/
  useAnimate: true,
  /*是否显示水印*/
  showWater: true,
  host, // 业务逻辑api地址（根据环境变量配置）
  hostUser,
};
