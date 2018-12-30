import {} from "mocha"
import {expect} from "chai"
import * as request from "request-promise-native"
import { EchoServer } from "../src/server";
import { LogFactory } from "../src/logging";

const port = 3000;
const url = `http://localhost:${port}`

describe('echo-validation', () => {

    let server: EchoServer;

    beforeEach(() => {
        const log = new LogFactory(false)
        server = new EchoServer(port, log)
        server.start()
    })

    afterEach(() => {
        server.stop();
    })

    it('should be available', async () => {
        const result = await request.get(url);

        expect(result).to.equal("hello")
    })
})