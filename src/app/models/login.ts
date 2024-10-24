export class Login {
  username: string;
  password: string;
  email: string;
  name: string; // Si has añadido el nombre
  birth_date: string;
  career: string;
  genre: string;
  occupation: string;
  phone: string;
  student_id: number;

  constructor(
    u: string,
    p: string,
    e: string,
    n: string,
    bd: string,
    c: string,
    g: string,
    o: string,
    ph: string,
    si: number
  ) {
    this.username = u;
    this.password = p;
    this.email = e;
    this.name = n;
    this.birth_date = bd;
    this.career = c;
    this.genre = g;
    this.occupation = o;
    this.phone = ph;
    this.student_id = si;
  }
}
