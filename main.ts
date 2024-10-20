import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Adjust the path if necessary

bootstrapApplication(AppComponent)
  .catch(err => console.error(err));
