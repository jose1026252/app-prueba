import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductData } from '../../interfaces/product-data.interface';
import { CookieService } from 'ngx-cookie-service';
import { ValidatorsService } from '../../shared/service/validators.service';
import { ProductService } from '../../services/product.service';
import { RoutingService } from '../../services/routing.service';
import { MessageModal } from '../../interfaces/message-modal.interface';
import { MpdalService } from '../../services/mpdal.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  public editProductForm: FormGroup = new FormGroup({});
  public dataEditProduct: ProductData = {} as ProductData;
  public showModal = false;
  public messageModal: MessageModal = {} as MessageModal;
  public modalErrorShow: boolean = false;
  public dateLiberation: any;
  public logoBank: string = './assets/img/logo_banco.png'
  public date: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly coookie: CookieService,
    private readonly validatorServic: ValidatorsService,
    private readonly productService: ProductService,
    public readonly routing: RoutingService,
    private readonly modalService: MpdalService,
    private datePipe: DatePipe
  ) { }
  ngOnInit(): void {
    const str = new Date().setSeconds(0,0);
    const [dt, tm] = new Date(str).toISOString().split('T');
    this.date = dt;
    this.dataEditProduct = this.coookie.get('product').length > 0 ? JSON.parse(this.coookie.get('product')) : {};
    this.modalService.$modalCloseError.subscribe((responseModalError: any) => {this.modalErrorShow = responseModalError});
    this.initForm();
    this.loadDataEditProduct();
  }

  initForm() {
    const [dateFechaLiberacion, timerInsc] = this.dataEditProduct.date_release!= null && this.dataEditProduct.date_release.length > 0 ? this.dataEditProduct.date_release.split('T'): [];
    this.editProductForm = this.fb.group({
      idTable: [''],
      idProduct: [{ disabled: true, value: '' }],
      nombreProducto: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      fechaLiberacion: ['', [Validators.required]],
      fechaReestructuracion: [{ disabled: true, value: '' }],
    }, {
      validators: [
        this.validatorServic.validateDate(dateFechaLiberacion, 'fechaLiberacion')
      ]
    });
  }

  loadDataEditProduct() {

      if (Object.keys(this.dataEditProduct).length > 0) {
        const [dateFechaRestruc, timer] = this.dataEditProduct.date_revision != null && this.dataEditProduct.date_revision.length > 0 ? this.dataEditProduct.date_revision.split('T'): [] ;
        const [dateFechaLiberacion, timerInsc] = this.dataEditProduct.date_release != null && this.dataEditProduct.date_release.length > 0 ? this.dataEditProduct.date_release.split('T'): [];
        this.editProductForm.patchValue({
          idProduct: this.dataEditProduct.idProduct,
          nombreProducto: this.dataEditProduct.name,
          descripcion: this.dataEditProduct.description,
          logo: this.dataEditProduct.logo,
          fechaLiberacion: dateFechaLiberacion,
          fechaReestructuracion: dateFechaRestruc,
          idTable: this.dataEditProduct.id
        });
      }


  }

  cleanForm() {
    this.editProductForm.reset();
  }

  isValidField(field: string) {
    const valid = this.validatorServic.isValidField(this.editProductForm, field);
    return valid;
  }

  onSubmit() {
    if (this.editProductForm.invalid) {
      this.editProductForm.markAllAsTouched();
      return;
    }
    const idProduct = this.editProductForm.get('idTable')?.value;
    const dataEdit: ProductData = {
      idProduct: this.editProductForm.get('idProduct')?.value,
      name: this.editProductForm.get('nombreProducto')?.value,
      description: this.editProductForm.get('descripcion')?.value,
      logo: this.editProductForm.get('logo')?.value,
      date_release: this.editProductForm.get('fechaLiberacion')?.value,
      date_revision: this.editProductForm.get('fechaReestructuracion')?.value,
      id: idProduct,
    }


    this.productService.updateProductData(idProduct, dataEdit).subscribe({
      next: (dataResponseUpdate) => {
        console.log('dataResponseUpdate', dataResponseUpdate);
        if (dataResponseUpdate?.status === 200 || dataResponseUpdate.status === 201) {
          this.routing.routingUrlRouter('/private/product-list');
        }else {
          this.modalError();
        }
      },
      error: (err) => {
        this.modalError();
      }
    });
  }

  modalError() {
    this.modalErrorShow = true;
  }

  functionCapturefecha(event: any) {
    console.log('event', event.target.value);
    const date = new Date(event.target.value);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate() + 1;
    const sumDate: string = this.datePipe.transform(new Date(year + 1, month, day),'yyyy-MM-dd') as string;
    this.reloadDateRevision(sumDate);
  }

  reloadDateRevision(date: string) {
    this.editProductForm.patchValue({
      fechaReestructuracion: date
    });
  }


}
