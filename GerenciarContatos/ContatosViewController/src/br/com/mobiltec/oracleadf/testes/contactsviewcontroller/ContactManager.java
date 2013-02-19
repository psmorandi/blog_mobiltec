package br.com.mobiltec.oracleadf.testes.contactsviewcontroller;

import com.sun.util.logging.Level;

import java.util.Date;

import oracle.adf.model.datacontrols.device.Contact;
import oracle.adf.model.datacontrols.device.ContactAddresses;
import oracle.adf.model.datacontrols.device.ContactField;
import oracle.adf.model.datacontrols.device.ContactName;
import oracle.adf.model.datacontrols.device.ContactOrganization;
import oracle.adf.model.datacontrols.device.DeviceManagerFactory;

import oracle.adfmf.amx.event.ActionEvent;
import oracle.adfmf.util.Utility;
import oracle.adfmf.util.logging.Trace;

public class ContactManager {
    public ContactManager() {
        super();
    }

    private String contactName = "";
    private String cellNumber = "";

    public void saveContact(ActionEvent _actionEvent) {
        // Add event code here...
        Trace.log(Utility.ApplicationLogger, Level.SEVERE, ContactManager.class, "saveContact",
                  "Chamou método para salvar o contato!");

        try {
            Contact contact = new Contact();
            
			ContactName cname = new ContactName();
            cname.setGivenName(contactName);
            cname.setFamilyName("Family Name");
            
			contact.setName(cname);
			
            contact.setNote(cellNumber); //colocando o número do cel. em notas para facilitar 
										 //o desenvolvimento deste exemplo
                        
			/*esta seria a maneira correta de colocar o telefone
            ContactField cf = new ContactField();
            cf.setType("mobile");
            cf.setValue(cellNumber);
            contact.setPhoneNumbers(new ContactField[] { cf });*/
						
            DeviceManagerFactory.getDeviceManager().createContact(contact);
        } catch (Exception ex) {
            Trace.log(Utility.ApplicationLogger, Level.SEVERE, ContactManager.class, "saveContact",
                      "Ocorreu um erro ao tentar salvar o contato!");
            Trace.log(Utility.ApplicationLogger, Level.SEVERE, ContactManager.class, "saveContact", ex);
        }
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getContactName() {
        return contactName;
    }

    public void setCellNumber(String cellNumber) {
        this.cellNumber = cellNumber;
    }

    public String getCellNumber() {
        return cellNumber;
    }

    public Contact[] getAllContacts() {
        return DeviceManagerFactory.getDeviceManager().findContacts("*", "", true);
    }
}
