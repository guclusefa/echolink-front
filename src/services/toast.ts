import Vue3Toastify, { toast, type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const toastifyOptions: ToastContainerOptions = {
  position: toast.POSITION.BOTTOM_RIGHT,
  theme: toast.THEME.AUTO
};

export default {
  install: (app: any) => {
    app.use(Vue3Toastify, toastifyOptions);
  }
};
