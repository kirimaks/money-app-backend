interface ModelType {
    save: () => number;
    delete: () => boolean;
    search: () => any;
}

class Model implements ModelType { 
    save() {
        return 0;
    }
    delete() {
        return true;
    }
    search() {
        return {};
    }
}
