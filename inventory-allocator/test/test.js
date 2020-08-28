const { InventoryAllocator } = require("../src/InventoryAllocator");
const { expect } = require("chai");

describe('InventoryAllocator', () => {
  let inventoryAllocator;

  beforeEach(() => {
    let order = new Map();
    let listOfWarehouses = [];
    inventoryAllocator = new InventoryAllocator(order, listOfWarehouses);
  });

  describe('Constructor Initialized', () => {
    it('Constructor Exists', () => {
      expect(InventoryAllocator).to.exist;
    });

    it('ordersMap and listOfWarehousesMap initialized', () => {
      expect(inventoryAllocator).to.have.property('ordersMap');
      expect(inventoryAllocator).to.have.property('listOfWarehousesMap');
    });
  }
  );

  describe('Null Order Check', () => {
    it('No order return empty', () => {
      expect(inventoryAllocator.ordersMap).to.eql(new Map());
    })
  })

  describe('Correct Order Check', () => {
    it('Return correct order', () => {
      let order = new Map([['apple', 11], ['banana', 2], ['orange', 5]]);
      inventoryAllocator.order = order;
      expect(inventoryAllocator.ordersMap).to.eql(order);
    })
  });

  describe('Warehouse null check', () => {
    it('Return empty result', () => {
      let newListOfWarehouses = [];
      inventoryAllocator.listOfWarehouses = newListOfWarehouses;
      expect(inventoryAllocator.listOfWarehouses).to.eql(newListOfWarehouses);
    })
  });

  describe('Correct warehouse details check', () => {
    it('Return correct warehouse inventory details', () => {
      let listOfWarehouses = [{ name: 'owd', inventory: { 'apple': 5, 'orange': 10 } }, { name: 'dm', inventory: { 'apple': 5, 'banana': 5, 'orange': 10 } }];
      inventoryAllocator.listOfWarehouses = listOfWarehouses;
      expect(inventoryAllocator.listOfWarehouses).to.eql(listOfWarehouses);
    })
  });

  describe('Functionality', () => {
    it('Return empty if warehouse does not have that item', () => {
      inventoryAllocator.order = new Map([[ 'cheetos', 2 ]]);
      inventoryAllocator.listOfWarehouses = [{ name: "owd", inventory: { cheetos: 0 } }];
      expect(inventoryAllocator.bestWayToShip()).to.eql([]);
    });

    it('Order can be shipped using one warehouse', () => {
      inventoryAllocator.order = new Map([[ 'apple', 1 ]]);
      inventoryAllocator.listOfWarehouses = [{ name: 'owd', inventory: { apple: 1 } }];
      expect(inventoryAllocator.bestWayToShip()).to.eql([ { name: 'owd', items: { apple: 1 } } ]);
    });

    it('Order can be shipped using multiple warehouses', () => {
      inventoryAllocator.order = new Map([[ 'apple', 10 ]]);
      inventoryAllocator.listOfWarehouses = [{ name: 'dm', inventory: { 'apple': 5 }}, { name: 'owd', inventory: { 'apple': 5 } }];
      expect(inventoryAllocator.bestWayToShip()).to.eql([ { name: 'dm', items: { apple: 5 } }, { name: 'owd', items: { apple: 5 } } ]);
    });

    it('Order cannot be shipped because there is not enough inventory', () => {
      inventoryAllocator.order = new Map([[ 'apple', 2 ]]);
      inventoryAllocator.listOfWarehouses = [{ name: 'owd', inventory: { 'apple': 1 }}];
      expect(inventoryAllocator.bestWayToShip()).to.eql([]);
    })

    it('If Order or List of Warehouses null, return empty as a result', () => {
      inventoryAllocator.order = new Map();
      inventoryAllocator.listOfWarehouses = [{ name: 'owd', inventory: { 'apple': 1 }}];
      expect(inventoryAllocator.bestWayToShip()).to.eql([]);

      inventoryAllocator.order = new Map([[ 'apple', 10 ]]);
      inventoryAllocator.listOfWarehouses = [];
      expect(inventoryAllocator.bestWayToShip()).to.eql([]);
    });

    it('Splitting multiple items accross different warehouses with exact amount in warehouses ', () => {
      inventoryAllocator.order = new Map([[ 'apple', 10 ], [ 'banana', 15 ]]);
      inventoryAllocator.listOfWarehouses = [{ name: 'dm', inventory: { 'apple': 5, 'banana': 10 }}, { name: 'owd', inventory: { 'apple': 5, 'banana': 5 } }];
      expect(inventoryAllocator.bestWayToShip()).to.eql([
        { name: 'dm', items: { apple: 5, banana: 10 } },
        { name: 'owd', items: { apple: 5, banana: 5 } }
      ]);
    })

    it('Splitting multiple items accross different warehouses with excess amount in warehouses ', () => {
      inventoryAllocator.order = new Map([[ 'apple', 10 ], [ 'banana', 15 ]]);
      inventoryAllocator.listOfWarehouses = [{ name: 'dm', inventory: { 'apple': 5, 'banana': 10 }}, { name: 'owd', inventory: { 'apple': 15, 'banana': 15 } }];
      expect(inventoryAllocator.bestWayToShip()).to.eql([
        { name: 'dm', items: { apple: 5, banana: 10 } },
        { name: 'owd', items: { apple: 5, banana: 5 } }
      ]);
    });

    it('Some items are availabe in warehouse some are not, show only the ones that are available', () => {
      inventoryAllocator.order = new Map([[ 'apple', 10 ], [ 'banana', 15 ]]);
      inventoryAllocator.listOfWarehouses = [{ name: 'dm', inventory: { 'apple': 5, 'banana': 10 }}, { name: 'owd', inventory: { 'apple': 4, 'banana': 15 } }];
      expect(inventoryAllocator.bestWayToShip()).to.eql([
        { name: 'dm', items: { banana: 10 } },
        { name: 'owd', items: { banana: 5 } }
      ])
    });
  });

});