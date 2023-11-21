/*
 * @Date: 2023-11-20 15:27:57
 * @LastEditors: zbx
 * @LastEditTime: 2023-11-21 17:38:26
 * @descript: 文件描述
 */
import { App } from 'vue';
import Chart from './chart/index.vue';
import Breadcrumb from './breadcrumb/index.vue';
// import SvgIcon from './svg-icon/index.vue';

import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, 
        DataZoomComponent, GraphicComponent,
} from 'echarts/components';
// Manually introduce ECharts modules to reduce packing size
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
]);

export default {
  install(Vue: App) {
    Vue.component('Chart', Chart);
    Vue.component('Breadcrumb', Breadcrumb);
    // Vue.component('SvgIcon', SvgIcon);
  },
};
