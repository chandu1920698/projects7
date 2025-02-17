import { LightningElement, wire } from 'lwc';
import createNoteRecord from '@salesforce/apex/NoteTakingController.createNoteRecord';
import getNotes from '@salesforce/apex/NoteTakingController.getNotes';
import updateNoteRecord from '@salesforce/apex/NoteTakingController.updateNoteRecord';
import deleteNoteRecord from '@salesforce/apex/NoteTakingController.deleteNoteRecord';
import LightningConfirm from 'lightning/confirm';
import { refreshApex } from "@salesforce/apex";

const DEFAULT_FORM_FORM = {
    Name : '',
    Note_Description__c : ''
};

export default class NoteTakingApp extends LightningElement {

    showModal = false;
    noteRecord = DEFAULT_FORM_FORM;
    noteList = [];
    selectedRecordId = '';
    wireNoteResult;
    formats = [
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'indent',
        'align',
        'link',
        'image',
        'clean',
        'table',
        'header',
        'color',
    ];

    @wire(getNotes) 
    noteListInfo(result) {
        this.wireNoteResult = result;
        const { data, error } = result;
        if(data) {
            this.noteList = data;
            console.log('data -> ' + JSON.stringify(data));
            this.noteList = data.map(item => {
                let formattedDate = new Date(item.LastModifiedDate).toDateString();
                return {...item, formattedDate};
            });
        } else if(error) {
            console.log('error -> ' + JSON.stringify(error));
            this.showToastMessage(error.message.body, 'error');
        }
    }

    get isFormInvalid() {
        return !(this.noteRecord && this.noteRecord.Note_Description__c && this.noteRecord.Name);
    }

    get modalName() {
        return this.selectedRecordId ? 'Update Note' : 'Add Note';
    }

    handleNewNoteCreate() {
        this.showModal = true;
    }

    handleCloseModal() {
        this.showModal = false;
        this.selectedRecordId = null;
        this.noteRecord = DEFAULT_FORM_FORM;
    }

    handleSaveModal(event) {
        event.preventDefault();
        console.log("this.noteRecord -> " + JSON.stringify(this.noteRecord));
        if(!this.selectedRecordId) {
            this.createNoteRecordHandler();
        } else {
            this.updateNoteRecordHandler();
        }
    }

    handleChange(event) {
        const {name, value} = event.target;
        this.noteRecord = {
            ...this.noteRecord,
            [name]: value
        };
    }

    createNoteRecordHandler() {
        createNoteRecord({title : this.noteRecord.Name, description : this.noteRecord.Note_Description__c})
        .then(response => {
            console.log('response -> ' + JSON.stringify(response));
            this.refresh();
            this.showToastMessage('Note created successfully', 'success');
            this.handleCloseModal();
        })
        .catch(error => {
            console.log(error);
            this.showToastMessage(error.message.body, 'error');
        });
    }

    showToastMessage(message, variant) {
        const notificationElement = this.template.querySelector('c-notification');
        if(notificationElement) {
            notificationElement.showToast(message, variant);
        }
    }

    handleNoteEdit(event) {
        console.log("event -> " + JSON.stringify(event));
        console.log("event -> " + JSON.stringify(event.target.dataset.recordid));

        const recordId = event.target.dataset.recordid;
        let noteRecord = this.noteList.find(note => note.Id === recordId);

        this.noteRecord = {
            Name : noteRecord.Name,
            Note_Description__c : noteRecord.Note_Description__c
        };

        this.selectedRecordId = recordId;
        this.showModal = true;

    }

    updateNoteRecordHandler() {
        updateNoteRecord({title : this.noteRecord.Name, description : this.noteRecord.Note_Description__c, noteId : this.selectedRecordId})
        .then(response => {
            console.log('response -> ' + JSON.stringify(response));     
            this.showToastMessage('Note updated successfully', 'success');
            this.refresh();
            this.handleCloseModal();
        })
        .catch(error => {
            console.log(error); 
            this.showToastMessage(error.message.body, 'error');
        });
    }


    handleNoteDelete(event) {
        console.log("event -> " + JSON.stringify(event.target.dataset.recordid));
        const recordId = event.target.dataset.recordid;
        this.handleConfirmDelete(recordId);
    }   

    async handleConfirmDelete(recordId) {
        const confirmaiton = await LightningConfirm.open({
            message : 'Are you sure, you want to delete this note?',
            variant : 'headerless',
            label : 'Delete Confirmation',
        });

        if(confirmaiton) {
            deleteNoteRecord({noteId : recordId})
            .then(response => {
                console.log('response -> ' + JSON.stringify(response));
                this.refresh(); 
                this.showToastMessage('Note deleted successfully', 'success');
            })
            .catch(error => {
                console.log(error); 
                this.showToastMessage(error.message.body, 'error'); 
            });
        }
    }

    refresh() {
        return refreshApex(this.wireNoteResult);
    }
}