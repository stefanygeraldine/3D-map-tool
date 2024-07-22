import { IViewer } from "../interfaces";

class Viewer implements IViewer {
  readonly token: string;
  protected isValidToken: boolean;

  constructor(token: string) {
    this.token = token;
    this.isValidToken = false;
  }

  protected validateToken() {
    this.token ? (this.isValidToken = true) : (this.isValidToken = false);
  }

  protected steMapWrapperStyle(elementId: string) {
    const note: HTMLElement | null = document.querySelector(`#${elementId}`);

    if (note) {
      note.style.position = "absolute";
      note.style.width = "100%";
      note.style.bottom = "0";
      note.style.top = "0";
    }
  }

  protected showUnauthorizedMessage(elementId: string): void {
    const invalidTokenMessage = document.createTextNode("Invalid token");
    const container = document.getElementById(elementId);
    container?.appendChild(invalidTokenMessage);
  }
}

export default Viewer;
