class Env {
  constructor(schema) {
    this.schema = schema;
    this.errors = [];
    this.validate(process.env);
  }
  validate(env) {
    for (const [key, isRequired] of Object.entries(this.schema)) {
      if (isRequired && !env[key]) {
        this.errors.push(`Missing required environment variable: ${key}`);
      }
    }
    if (this.errors.length > 0) {
      this.logErrors();
      process.exit(1);
    }
  }
  logErrors() {
    console.error("\nEnvironment validation failed:");
    this.errors.forEach(err => console.error(err));
  }
}

new Env({
  PORT: true,
  MONGO_URI: true,
  MONGO_DB_NAME: true,
  TOKEN_SECRET: true,
  REFRESH_TOKEN_SECRET: true,
})
