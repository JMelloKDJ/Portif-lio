// The phone is explicit public content supplied by the owner; never inferred.
export function renderPhone(person){
 if(!person.phone)return '';
 const {number,display}=person.phone;
 if(!/^\+[1-9]\d{7,14}$/.test(number)||!/^\+[\d ()-]+$/.test(display))throw new Error('Invalid public phone');
 return '<a class="contact-phone" href="tel:'+number+'">'+display+'</a>';
}
