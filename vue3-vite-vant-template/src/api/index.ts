const mode: string = import.meta.env.MODE;
let baseUrl: string = '';
if(mode === 'development') {
  baseUrl = '';
}else if(mode === 'uat') {
  baseUrl = '';
}else if(mode === 'production') {
  baseUrl = '';
}

export default mode;