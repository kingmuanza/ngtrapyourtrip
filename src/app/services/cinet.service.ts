import { Injectable } from '@angular/core';
declare const CinetPay: any;

@Injectable({
  providedIn: 'root'
})
export class CinetService {

  private apikey = '14805067945e0b6eb3374f47.48751476';
  // tslint:disable-next-line:variable-name
  private site_id = 962769;
  // tslint:disable-next-line:variable-name
  private notify_url = 'http://trapyourtrip/cinetpay/notify/index_notify.php';

  // tslint:disable-next-line:variable-name
  private trans_id: any; // Your transaction id
  // tslint:disable-next-line:variable-name
  private cpm_custom: any;
  private designation: any;
  private currency = 'CFA';

  constructor() { }

  seamless(amount: number) {
    return new Promise(resolve => {

      // Generation d'une id de transaction
      // tslint:disable-next-line:max-line-length
      this.trans_id = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();


      CinetPay.setConfig({
        apikey: this.apikey,
        site_id: this.site_id,
        notify_url: this.notify_url
      });
      // Lorsque la signature est généré
      CinetPay.on('signatureCreated', (token) => {
          console.log('Tocken généré: ' + token);
        });
      CinetPay.on('paymentPending', (e) => {
          console.log('code:' + e.code + 'Message::' + e.message);
        });
      CinetPay.on('error', (e) => {
          console.log('Error code:' + e.code + 'Message::' + e.message);
        });
      CinetPay.on('paymentSuccessfull', (paymentInfo) => {
          resolve(paymentInfo);
          /*
            //if payment is successfull paymentInfo.cpm_result == '00'
              if (typeof paymentInfo.lastTime != 'undefined') {
                if (paymentInfo.cpm_result == '00') {
                }
              }
          */
        });

      CinetPay.setSignatureData({
        // tslint:disable-next-line:object-literal-shorthand
        amount: amount,
        trans_id: this.trans_id,
        currency: this.currency,
        designation: this.designation,
        custom: this.cpm_custom
      });

      CinetPay.getSignature();

    });
  }

}
