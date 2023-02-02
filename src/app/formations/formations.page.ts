import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import Formation from "../core/models/Formation";
import FormationService from "../core/services/formation.service";

@Component({
  standalone: true,
  selector: 'app-formations',
  templateUrl: 'formations.page.html',
  styleUrls: ['formations.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  providers: [],
})
export class FormationsPage implements OnInit
{
  protected formations!: Observable<Formation[]>;

  constructor(
    private formationService: FormationService
  ) {

  }

  ngOnInit(): void {
    // Load all the formations, including their courses
    const params = {
      includeRelations: 'courses',
      sortBy: 'desc(name)',
    };

    this.formationService.get(params).subscribe({
      next: (data) => {
        this.formations = data;

        console.log(this.formations);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

}
