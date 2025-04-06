declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module 'handsontable/dist/handsontable.full.min.css' {
  const content: any;
  export default content;
} 