import { Component, OnInit } from '@angular/core';
import {VehicleModel} from "../VehicleModel";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalCarSlot = 10;
  totalEmptySlot = 0;
  totalParked = 0;
  vehicleTypeName = ["Microbus", "Car", "Truck"];
  vehicleTypeCount = [0, 0, 0];

  vehicleList: Array<VehicleModel> = new Array<VehicleModel>();
  parkingList: Array<VehicleModel> = new Array<VehicleModel>();

  constructor() { }

  ngOnInit(): void {
    this.loadVehicleInfo();
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
    this.getVehicleTypeCount();
  }

  getEmptySlotCount() {
    this.totalEmptySlot = 0;
    this.totalParked = this.parkingList.length;
    for (let i = 0; i < this.vehicleList.length; i++) {
      if (this.vehicleList[i].status == 1) {
        this.totalEmptySlot++;
      }
    }
    console.log(this.totalEmptySlot);
    console.log(this.totalParked);
  }

  getVehicleTypeCount() {
    this.vehicleTypeCount = [0, 0, 0];
    for (let i = 0; i < this.parkingList.length; i++) {
      this.vehicleTypeCount[this.vehicleTypeName.indexOf(this.parkingList[i].vehicleType)]++;
    }
  }

}
