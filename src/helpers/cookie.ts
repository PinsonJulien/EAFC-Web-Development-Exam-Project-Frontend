export interface ICookie {
  name: string;
  value: string;
}

export default class Cookie {

  public static getCookies(): string {
    return document.cookie;
  }

  public static getCookie(name: string): ICookie | undefined {
    const cookie: string[] | undefined = this.getCookies()
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=');

    if (cookie === undefined) return undefined;
    
    return {
      name: cookie[0],
      value: cookie[1]
    }
  }

  public static getCookieValue(name: string): string | undefined {
    return this.getCookie(name)?.value;
  }

  public static removeCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"`;
  }
}