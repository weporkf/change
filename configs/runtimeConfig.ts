interface IRuntimeConfigPublic {
  [key: string]: string | boolean | object;
}

interface IRuntimeConfigPrivate {
  [key: string]: string | boolean | object;
}

interface IRuntimeConfig {
  public: IRuntimeConfigPublic;
  private: IRuntimeConfigPrivate;
}

type RuntimeConfigType = Omit<IRuntimeConfig, "public"> & {
  public: IRuntimeConfigPublic;
  private: IRuntimeConfigPrivate;
};

export const runtimePublic: IRuntimeConfigPublic = {
  GQL_HOST: process.env.BASE_URL || "http://localhost:3000",
};

export const runtimePrivate: IRuntimeConfigPrivate = {};

export const runtimeConfig: RuntimeConfigType = {
  private: runtimePrivate,
  public: runtimePublic,
};
