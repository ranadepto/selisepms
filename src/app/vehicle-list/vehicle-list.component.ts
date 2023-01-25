import {Component, OnInit} from '@angular/core';
import {VehicleModel} from "../VehicleModel";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {

  totalCarSlot: number = 10;
  totalEmptySlot: number = 0;
  availableSlotID: number = -1;
  vehicleList: Array<VehicleModel> = new Array<VehicleModel>();
  parkingList: Array<VehicleModel> = new Array<VehicleModel>();
  newParking: VehicleModel = new VehicleModel();
  selectedParking: VehicleModel = new VehicleModel();
  isAddVehicleModalVisible = false;

  vehicleTypeName = ["Microbus", "Car", "Truck"];
  vehicleTypeCharge = [200, 100, 300];

  validateForm!: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.loadVehicleInfo();

    this.validateForm = this.fb.group({
      id: [null, [Validators.required]],
      vehicleLicenceNumber: [null, [Validators.required]],
      vehicleType: [null, [Validators.required]],
      vehicleOwnerName: [null, [Validators.required]],
      vehicleOwnerPhone: [''],
      carOwnerAddress: [''],
      parkingCharge: [0],
      status: [''],
      carEntry: [''],
      carExit: ['']
    });

    console.log(JSON.stringify(this.vehicleList));
  }

  loadVehicleInfo() {
    if (localStorage.getItem('SelisePMSVehicleList')) {
      this.vehicleList = JSON.parse(<string>localStorage.getItem('SelisePMSVehicleList'));
    } else {
      for (let i = 0; i < this.totalCarSlot; i++) {
        this.vehicleList.push(new VehicleModel());
        this.vehicleList[i].id = i;
        this.vehicleList[i].carEntry = "" + new Date();
        this.vehicleList[i].status = 0;
      }
      localStorage.setItem('SelisePMSVehicleList', JSON.stringify(this.vehicleList));
    }

    if (localStorage.getItem('SelisePMSParkingList')) {
      this.parkingList = JSON.parse(<string>localStorage.getItem('SelisePMSParkingList'));
    } else {
      for (let i = 0; i < 3; i++) {
        this.parkingList.push(new VehicleModel());
        this.parkingList[i].id = i;
        this.parkingList[i].vehicleOwnerName = "Test Name "+i;
        this.parkingList[i].vehicleType = this.vehicleTypeName[0];
        this.parkingList[i].vehicleLicenceNumber = "Dhaka-10000"+i;
        this.parkingList[i].status = i % 2;
      }
      localStorage.setItem('SelisePMSParkingList', JSON.stringify(this.parkingList));
    }

    this.getEmptySlotCount();
  }


  // Modal Start
  showAddVehicleModal(): void {
    this.getNextAvailableSlotID();
    this.newParking = new VehicleModel();
    this.newParking.id = this.availableSlotID;
    this.isAddVehicleModalVisible = true;
  }

  addVehicle(): void {
    this.saveParkingRecord();
    this.isAddVehicleModalVisible = false;
  }

  saveParkingRecord() {
    this.parkingList.push(this.newParking);
    this.vehicleList[this.availableSlotID] = this.newParking;
    localStorage.setItem('SelisePMSVehicleList', JSON.stringify(this.vehicleList));
    localStorage.setItem('SelisePMSParkingList', JSON.stringify(this.parkingList));

    this.loadVehicleInfo();
  }

  handleCancel(): void {
    this.isAddVehicleModalVisible = false;
  }
  // Modal End


  // DateTime Picker Start
  onCarEntryChange(result: Date): void {
    this.newParking.carEntry = result.toString();
  }

  onCarEntryOk(result: Date | Date[] | null): void {
    // @ts-ignore
    this.newParking.carEntry = result.toString();
  }

  onCarExitChange(result: Date): void {
    this.newParking.carExit = result.toString();
  }

  onCarExitOk(result: Date | Date[] | null): void {
    // @ts-ignore
    this.newParking.carExit = result.toString();
  }
  // DateTime Picker End

  getEmptySlotCount() {
    this.totalEmptySlot = 0;
    for (let i = 0; i < this.totalCarSlot; i++) {
      if (this.vehicleList[i].status == 1) {
        this.totalEmptySlot++;
      }
    }
  }

  getNextAvailableSlotID() {
    for (let i = 0; i < this.totalCarSlot; i++) {
      if (this.vehicleList[i].status == 1) {
        this.availableSlotID = i;
        break;
      }
    }
  }

  setParkingCharge() {
    let index = this.vehicleTypeName.indexOf(this.newParking.vehicleType);
    this.newParking.parkingCharge = this.vehicleTypeCharge[index];
  }


}
