import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
   * It gets the first leter for profile image
   */
  getFirstLetter(term: string): string {
    return term[0].toUpperCase();
  }

  /**
   * Show Toast Notification Message
   * @param key 
   * @param severity 
   * @param summary 
   * @param detail 
   */
  showToastMessage(key: string, severity: string, summary: string, detail: string, messageService: MessageService) {
    messageService.add({
      key: key, 
      severity: severity, 
      summary: summary, 
      detail: detail,
      life: 4000,
      closable: false
    });
  }

}
