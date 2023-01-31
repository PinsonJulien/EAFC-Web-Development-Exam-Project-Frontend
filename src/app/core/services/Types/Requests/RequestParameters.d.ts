/*
{
  param1: 'test',
  param2: 42,
  param3: true
}
*/
declare type RequestParameters = {
  [param: string]: string | number | boolean | readonly(string | number | boolean)[]
}
