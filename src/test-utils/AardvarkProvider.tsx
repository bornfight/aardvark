import { AxiosInstance } from "axios";
import * as React from "react";
import { AardvarkProviderProps } from "../test-utils/interfaces/AardvarkProviderProps";

export class AardvarkProvider extends React.Component<AardvarkProviderProps> {
    public render() {
        const Context = React.createContext<AxiosInstance | undefined>(
            undefined,
        );

        return (
            <Context.Provider value={this.props.httpAdapter}>
                {this.props.children}
            </Context.Provider>
        );
    }
}
