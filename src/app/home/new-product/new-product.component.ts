import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { registerProduct } from 'src/app/models/product.model';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { NotificationsService } from 'src/app/shared/services/notifications.service';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {
  public form: FormGroup
  public categories: any[] = [];
  public imageUrl: any
  urlFinalImage: string;
  files: File[] = [];

  constructor(
    private categoriesService: CategoriesService,
    private productService: ProductsService,
    private formBuilder: FormBuilder,
    private alertService: NotificationsService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe((res: any) => {
      console.log('estas son las categorias...', res);
      this.categories = res.categories;
      console.log(this.categories);

    })

    this.form = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      image: [Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      price: [Validators.compose([Validators.required])],
      quantity: [Validators.compose([Validators.required])],
      short_desc: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      cat_id: ['',Validators.compose([Validators.required])]
    })
  }
  onSelect(event: Event) {
    this.spinner.show();
    const inputElement = event.target as HTMLInputElement;

    // Verificar si `files` está definido
    if (inputElement?.files) {
      const filesArray = Array.from(inputElement.files); // Convertir FileList a Array<File>
      this.files.push(...filesArray);
      console.log('Archivos añadidos:', this.files);

      // Previsualizar la imagen
      const file = this.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;  // Asigna la URL de la imagen para previsualizar
      };
      reader.readAsDataURL(file);
    } else {
      console.log('Se daño');

    }
    if (this.files.length === 0) return console.log('Ni entra');
    const file_data = this.files[0];
    const data = new FormData();
    data.append('file', file_data);
    data.append('upload_preset', 'pueblitos-y-tintico');
    data.append('cloud_name', 'da4si8eaz');



    this.productService.uploadImages(data).subscribe(
      {
        next: (response: any) => {
          console.log(response);
          this.urlFinalImage = response.url
          this.spinner.hide()
        },
        error: (e: any) => {
          console.log('daño ', e);
          this.alertService.errorNotifi('Ups','Error al subir imagen')
        }
      }
    )
    return true;
  }

  onSubmit(form: any) {
    this.spinner.show();
    console.log('este es form ----> ', form);
    const catid = Number(form.cat_id);
    console.log('este es id de cate ', catid);

    const data: registerProduct = {
      title: form.title,
      image: this.urlFinalImage,
      description: form.description,
      price: form.price,
      quantity: form.quantity,
      short_desc: form.short_desc,
      cat_id: catid
    }
    this.productService.registerNewProducts(data).then((res: any)=>{
      console.log('esto responde el back', res);
      this.spinner.hide();
      this.alertService.successfulRedirects('Ok', 'Producto creado', 'pages')
    }).catch((err)=>{
      this.spinner.hide();
      console.log('error', err);
      this.alertService.errorNotifi('Ups', 'No logre crear el producto')
      
    })
  }
  
}
