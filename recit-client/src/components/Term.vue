<template>
    <div class="term-container">
        <div id="xterm" class="xterm" />
    </div>
</template>

<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'

export default {
    props: {
        socketURI:{
            type: String,
            default: 'ws://localhost:9999'
        }
    },
    mounted(){
        this.initSocket()
    },
    beforeDestroy(){
        this.socket && this.socket.close()
        this.term && this.term.dispose()
    },
    methods:{
        initTerm(){
            const term = new Terminal({
                fontSize: 14,
                cursorBlink: true,
                cursorStyle:'underline',
            })
            const attachAddon = new AttachAddon(this.socket)
            const fitAddon = new FitAddon()
            term.loadAddon(attachAddon)
            term.loadAddon(fitAddon)
            term.open(document.getElementById('xterm'))
            fitAddon.fit()
            term.focus()
            this.term = term
        },
        initSocket(){
            this.socket = new WebSocket(this.socketURI)
            this.socketOnClose()
            this.socketOnOpen()
            this.socketOnError()
        },
        socketOnOpen(){
            this.socket.onopen = () => {
                this.initTerm()
            }
        },
        socketOnClose(){
            this.socket.onclose = () =>  {
                console.log('close socket')
            }
        },
        socketOnError(){
            this.socket.onerror = () => { console.log('err')}
        }
    }
}
</script>