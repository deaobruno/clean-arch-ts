import IDbDriver from "./IDbDriver";

export default class InMemoryDriver implements IDbDriver {
  private static instance: InMemoryDriver;
  private data: any = {};

  private constructor() {}

  static getInstance(): InMemoryDriver {
    if (!InMemoryDriver.instance)
      InMemoryDriver.instance = new InMemoryDriver();

    return InMemoryDriver.instance;
  }

  async create(source: string, data: any): Promise<void> {
    if (!this.data[source]) this.data[source] = [];

    this.data[source].push(data);
  }

  async find(source: string, filters: object = {}): Promise<any[]> {
    const filterKeys = Object.keys(filters);
    const result: any[] = [];

    if (filterKeys.length <= 0) return this.data[source];

    if (!this.data[source]) this.data[source] = [];

    this.data[source].forEach((item: any) => {
      let found = true;

      filterKeys.forEach(
        (paramKey) =>
          (found = item[paramKey] === filters[paramKey] ? true : false)
      );

      if (found) result.push(item);
    });

    return result;
  }

  async findOne(source: string, filters: object): Promise<any> {
    const results = await this.find(source, filters);

    return results[0];
  }

  async update(source: string, data: any, filters?: object): Promise<void> {
    const item = filters && (await this.findOne(source, filters));

    if (item) {
      const filterKeys = Object.keys(filters);

      this.data[source] = this.data[source].map((item: any) => {
        let found = true;

        filterKeys.forEach(
          (paramKey) =>
            (found = item[paramKey] === filters[paramKey] ? true : false)
        );

        return found ? data : item;
      });
    }
  }

  async delete(source: string, filters = {}): Promise<void> {
    if (this.data[source])
      this.data[source] = this.data[source].filter((item: any) => {
        let found = true;

        Object.keys(filters).forEach((paramKey: string) => {
          if (item[paramKey] !== filters[paramKey]) found = false;
        });

        if (!found) return item;
      });
  }
}
