import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";

class SignalRService {
  private connection: HubConnection | null = null;

  async startConnection(hubUrl: string): Promise<void> {
    try {
      // Stop any existing connection
      if (this.connection && this.connection.state === HubConnectionState.Connected) {
        await this.connection.stop();
      }

      // Create a new connection
      this.connection = new HubConnectionBuilder()
        .withUrl(hubUrl) // Replace with your SignalR hub URL
        .withAutomaticReconnect()
        .build();

      // Start the connection
      await this.connection.start();
      console.log("SignalR connection established!");
    } catch (error) {
      console.error("Error establishing SignalR connection:", error);
      throw error;
    }
  }

  on(eventName: string, callback: (data: any) => void): void {
    if (this.connection) {
      this.connection.on(eventName, callback);
    } else {
      console.error("SignalR connection is not established. Cannot subscribe to events.");
    }
  }

  async stopConnection(): Promise<void> {
    if (this.connection && this.connection.state === HubConnectionState.Connected) {
      await this.connection.stop();
      console.log("SignalR connection stopped.");
    }
  }

  async invoke(methodName: string, ...args: any[]): Promise<any> {
    if (this.connection) {
      try {
        return await this.connection.invoke(methodName, ...args);
      } catch (error) {
        console.error(`Error invoking SignalR method "${methodName}":`, error);
        throw error;
      }
    } else {
      console.error("SignalR connection is not established. Cannot invoke method.");
    }
  }
}

export const signalRService = new SignalRService();
