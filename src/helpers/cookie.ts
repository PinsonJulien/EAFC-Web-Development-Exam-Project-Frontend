export default class Cookie {

  public static getCookies(): string {
    return document.cookie;
  }

  public static getCookieValue(name: string): string | undefined {
    return this.getCookies()
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
      ?.split('=')[1];
  }
}
