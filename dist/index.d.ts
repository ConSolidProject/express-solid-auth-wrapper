interface IConfig {
    email: string;
    password: string;
    idp: string;
}
declare function setSatellite(config: IConfig): Promise<(req: any, res: any, next: any) => Promise<void>>;
declare function extractWebId(req: any, res: any, next: any): Promise<void>;
export { extractWebId, setSatellite };
//# sourceMappingURL=index.d.ts.map