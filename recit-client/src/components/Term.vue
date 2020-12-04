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
        // this.initSocket()
    },
    beforeDestroy(){
        this.socket && this.socket.close()
        this.term && this.term.dispose()
    },
    methods:{
        init(){
            if(this.term) return 
            this.initSocket()
        },
        initTerm(){
            const term = new Terminal({
                fontSize: 14,
                cursorBlink: 'bar',
                cursorStyle:'underline',
                // disableStdin: true,
                theme: {
                    background: '#fff',
                    foreground: 'black',
                }
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

<style lang="less" scoped>
.term-container{
    border: 2px solid black ;
    border-radius: 6px;
    padding: 5px 15px;
}
</style>