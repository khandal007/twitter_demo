module.exports.constants = {
    site_name: 'Twitter Demo',
    site_code:'CV',
	author: 'The Catalyst',
	site_type:["Project","Stock","Others"],
    tds_percentage:[1,1.5,2,5,7.5,10,20,30],
    gst_percentage:[15,18,12,28,5,0],
    head_category:["","Registered","Composite","Unregistered"],
    head_worktype:["","Consumable Goods","Fixed Asset","Service","Work Contract"],
    supply_type:[1,5,12],
    site_status:["No work done","Withdrawn","Hold/Wip","Wip","Repeat","Complete"],
    invoice_type:["Unregistered","CGST/SGST","IGST"],
    mailedfrom_type:["None","SMTP","Gmail"],
    vendor_type:[
            {
                id:5,
                workType:"Vendor"
            },
            {
                id:-1,
                workType:"Fixed"
            },
            {
                id:-1,
                workType:"Market"
            }
    ],   
    payment_mode:[
            {
                id:1,
                modeName:"Unreg Expenditure",
                code:"URGEX",
                type:"expense",
                category:"Transaction",
                drType:[8,9],
                crType:[1,2,3,5,10],
                colorcode: '#0000ff'
            },
            {
                id:2,
                modeName:"Reg Expenditure",
                code:"RGEX",
                type:"expense",
                category:"Transaction",
                drType:[1,2,3,5,10],
                crType:[1,2,3,5,10,9],
                colorcode: '#0000ff'
            },
            {
                id:3,
                modeName:"JV",
                code:"JV",
                type:"payment",
                category:"Transaction",
                drType:[1,2,3,5,8,9,10],
                crType:[1,2,3,5,8,9,10],
                colorcode: '#FF0000'
            },
            {
                id:4,
                modeName:"Payment-Cash",
                code:"PYC",
                type:"payment",
                category:"Payment",
                drType:[1,2,3,4,5,6,7,8,9,10],
                crType:[13],
                colorcode: '#FF0000'
            },
            {
                id:5,
                modeName:"Payment-Bank",
                code:"PYB",
                type:"payment",
                category:"Payment",
                drType:[1,2,3,4,5,6,7,8,9,10],
                crType:[2],
                colorcode: '#FF0000'
            },
            {
                id:6,
                modeName:"GRN",
                code:"GRN",
                type:"inventory",
                category:"Inventory",
                drType:[8,9],
                crType:[1,5,12],
                colorcode: '#008000'
            },
            {
                id:7,
                modeName:"STN",
                code:"STN",
                type:"inventory",
                category:"Inventory",
                drType:[8,9],
                crType:[10],
                colorcode: '#FF0000'
            },
            {
                id:8,
                modeName:"SRN",
                code:"SRN",
                type:"inventory",
                category:"Inventory",
                drType:[8,9],
                crType:[9,10],
                colorcode: '#0000ff'
            },
            {
                id:9,
                modeName:"REVENUE",
                code:"REV",
                type:"revenue",
                category:"Transaction",
                drType:[4],
                crType:[14],
                colorcode: '#0000ff'
            },
            // {
            //     id:10,
            //     modeName:"Purchase",
            //     code:"PUR",
            //     type:"inventory",
            //     category:"Transaction",
            //     drType:[8,9],
            //     crType:[1,5,12],
            //     colorcode: '#008000'
            // },
        ],
       workMode:[
            {
                id:10,
                workType:"Ledger"
            },
            {
                id:20,
                workType:"Document"
            },
            {
                id:7,
                workType:"Unreg Expenditure"
            },
            {
                id:14,
                workType:"Registered Expenditure"
            },
            {
                id:21,
                workType:"JV"
            },
            {
                id:28,
                workType:"Payment-Cash"
            },
            {
                id:35,
                workType:"Payment-Bank"
            },
            {
                id:42,
                workType:"GRN"
            }, 
            {
                id:49,
                workType:"STN"
            },
            {
                id:56,
                workType:"SRN"
            },
            {
                id:63,
                workType:"Revenue"
            },
            {
                id:100,
                workType:"LR"
            }, 
            {
                id:110,
                workType:"Project"
            }, 
            {
                id:120,
                workType:"Costcenter"
            },
            {
                id:130,
                workType:"Goods"
            }
    ],   
    account_type:{
         1:{
                name: "Supplier",
                code:"SUP"
          },
        2:{
                name:"Company Bank",
                code:"CBB"
          },
        3:{
                name:"Imprest A/C",
                code:"IMP"
          },
        4:{
                name:"Customer",
                code:"CUS"
          },
        5:{
                name:"Vendor",
                code:"VND"
          },
        6:{
                name:"Government Tax & Duties",
                code:"GTD"
          },
        7:{
                name:"GST Tax",
                code:"GST"
          },  
        8:{
                name:"Indirect Expenses",
                code:"IDX"
          },
        9:{
                name:"Direct Expenses",
                code:"DRX"
          },       
        10:{
                name:"Consumable Goods",
                code:"AST"
          }, 
        11:{
                name:"Fixed Assets",
                code:"ASF"
          },
        12:{
                name:"Others",
                code:"OTH"
          },
        13:{
                name:"Company Cash",
                code:"CBC"
          },
        14:{
                name:"Revenue",
                code:"REV"
          },
        15:{
                name:"Fixed Vendor",
                code:"FVD"
           },
        16:{
                name:"Market Vendor",
                code:"MVD"
           },
        17:{
                name:"LR Account",
                code:"LRA"
            }       
     },
     uom:{
           1:{
                fullName: "BAGS",
                quantity_type: "Measure",
                name: "BAG"
            },
           2:{
                fullName: "BALE",
                quantity_type: "Measure",
                name: "BAL"
            },
            3:{
                fullName: "BUNDLES",
                quantity_type: "Measure",
                name: "BDL"
            },
            4:{
                fullName: "BUCKLES",
                quantity_type: "Measure",
                name: "BKL"
            },
            5:{
                fullName: "BILLIONS OF UNITS",
                quantity_type: "Measure",
                name: "BOU"
            },
            6:{
                fullName: "BOX",
                quantity_type: "Measure",
                name: "BOX"
            },
            7:{
                fullName: "BOTTLES",
                quantity_type: "Measure",
                name: "BTL"
            },
            8:{
                fullName: "BUNCHES",
                quantity_type: "Measure",
                name: "BUN"
            },
            9:{
                fullName: "CANS",
                quantity_type: "Measure",
                name: "CAN"
            },
            10:{
                fullName: "CUBIC METER",
                quantity_type: "Volume",
                name: "CBM"
            },
            11:{
                fullName: "CUBIC CENTIMETER",
                quantity_type: "Volume",
                name: "CCM"
            },
            12:{
                fullName: "CENTIMETER",
                quantity_type: "Length",
                name: "CMS"
            },
            13:{
                fullName: "CARTONS",
                quantity_type: "Measure",
                name: "CTN"
            },
            14:{
                fullName: "DOZEN",
                quantity_type: "Measure",
                name: "DOZ"
            },
            15:{
                fullName: "DRUM",
                quantity_type: "Measure",
                name: "DRM"
            },
            16:{
                fullName: "GREAT GROSS",
                quantity_type: "Measure",
                name: "GGR"
            },
            17:{
                fullName: "GRAMS",
                quantity_type: "Weight",
                name: "GMS"
            },
            18:{
                fullName: "GROSS",
                quantity_type: "Measure",
                name: "GRS"
            },
            19:{
                fullName: "GROSS YARDS",
                quantity_type: "Length",
                name: "GYD"
            },
            20:{
                fullName: "KILOGRAMS",
                quantity_type: "Weight",
                name: "KGS"
            },
            21:{
                fullName: "KILOLITER",
                quantity_type: "Volume",
                name: "KLR"
            },
            22:{
                fullName: "KILOMETRE",
                quantity_type: "Length",
                name: "KME"
            },
            23:{
                fullName: "MILLILITRE",
                quantity_type: "Volume",
                name: "MLT"
            },
            24:{
                fullName: "METERS",
                quantity_type: "Length",
                name: "MTR"
            },
            25:{
                fullName: "NUMBERS",
                quantity_type: "Measure",
                name: "NOS"
            },
            26:{
                fullName: "PACKS",
                quantity_type: "Measure",
                name: "PAC"
            },
            27:{
                fullName: "PIECES",
                quantity_type: "Measure",
                name: "PCS"
            },
            28:{
                fullName: "PAIRS",
                quantity_type: "Measure",
                name: "PRS"
            },
            29:{
                fullName: "QUINTAL",
                quantity_type: "Weight",
                name: "QTL"
            },
            30:{
                fullName: "ROLLS",
                quantity_type: "Measure",
                name: "ROL"
            },
            31:{
                fullName: "SETS",
                quantity_type: "Measure",
                name: "SET"
            },
            32:{
                fullName: "SQUARE FEET",
                quantity_type: "Area",
                name: "SQF"
            },
            33:{
                fullName: "SQUARE METERS",
                quantity_type: "Area",
                name: "SQM"
            },
            34:{
                fullName: "SQUARE YARDS",
                quantity_type: "Area",
                name: "SQY"
            },
            35:{
                fullName: "TABLETS",
                quantity_type: "Measure",
                name: "TBS"
            },
            36:{
                fullName: "TEN GROSS",
                quantity_type: "Measure",
                name: "TGM"
            },
            37:{
                fullName: "THOUSANDS",
                quantity_type: "Measure",
                name: "THD"
            },
            38:{
                fullName: "TONNES",
                quantity_type: "Weight",
                name: "TON"
            },
            39:{
                fullName: "TUBES",
                quantity_type: "Measure",
                name: "TUB"
            },
            40:{
                fullName: "US GALLONS",
                quantity_type: "Volume",
                name: "UGS"
            },
            41:{
                fullName: "UNITS",
                quantity_type: "Measure",
                name: "UNT"
            },
            42:{
                fullName: "YARDS",
                quantity_type: "Length",
                name: "YDS"
            },
            43:{
                fullName: "OTHERS",
                quantity_type: "",
                name: "OTH"
            },
            44:{
                fullName: "Metric Ton",
                quantity_type: "Weight",
                name: "MT"
            },
            45:{
                fullName: "Liter",
                quantity_type: "Weight",
                name: "LTR"
            },
            46:{
                fullName: "Cubic Feet",
                quantity_type: "Measure",
                name: ""
            },
            47:{
                fullName: "Per Site",
                quantity_type: "Measure",
                name: ""
            },
            48:{
                fullName: "Per Leg",
                quantity_type: "Measure",
                name: ""
            },
            49:{
                fullName: "Per Meter Cube",
                quantity_type: "Measure",
                name: "Per m3"
            },
            50:{
                fullName: "Feet",
                quantity_type: "Measure",
                name: ""
            },
            51:{
                fullName: "Per Roll",
                quantity_type: "Measure",
                name: ""
            },
            52:{
                fullName: "Per Poll",
                quantity_type: "Measure",
                name: ""
            },
            53:{
                fullName: "Per Day",
                quantity_type: "Measure",
                name: ""
            },
            54:{
                fullName: "Per Hour",
                quantity_type: "Measure",
                name: "Per Hr"
            },
            55:{
                fullName: "Per Month",
                quantity_type: "Measure",
                name: ""
            },
            56:{
                fullName: "Per Year",
                quantity_type: "Measure",
                name: ""
            },
            57:{
                fullName: "Each",
                quantity_type: "Measure",
                name: "EA"
            },
            58:{
                fullName: "Lumpsum",
                quantity_type: "Measure",
                name: ""
            }
     }
};