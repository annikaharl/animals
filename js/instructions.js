export class InstructionPanel {
    constructor() {
        this.dismissBtn = document.getElementById('instruction-dismiss');
        this.callbacks = {
            onDismiss: null
        };
        
        this.init();
    }
    
    init() {
        // Set up dismiss button listener
        if (this.dismissBtn) {
            this.dismissBtn.addEventListener('click', () => {
                this.dismiss();
            });
        }
    }
    
    dismiss() {
        if (this.callbacks.onDismiss) {
            this.callbacks.onDismiss();
        }
    }
    
    onDismiss(callback) {
        this.callbacks.onDismiss = callback;
    }
}