exports.schema = {
  "entities":[
    {
      "kind":"User",
      "namespace":"default",
      "version":"v1",
      "latest":true,
      "description":"Everything about the User entity",
      "names":{
        "plural":"users",
        "singular":"user"
      },
      "schema":{
        "type":"object",
        "properties":{
          "uid":{
            "type":"string",
            "description":"id of the user"
          }
        },
        "required":[
          "uid"
        ]
      },
      "migrationsFrom":{
        
      }
    },
    {
      "kind":"Restaurant",
      "namespace":"default",
      "version":"v1",
      "latest":true,
      "description":"Everything about the Restaurant entity",
      "names":{
        "plural":"restaurants",
        "singular":"restaurant"
      },
      "schema":{
        "type":"object",
        "properties":{
          "uid":{
            "type":"string",
            "description":"id of the Restaurant"
          }
        },
        "required":[
          "uid"
        ]
      },
      "migrationsFrom":{
        "v0":[
          {
            "op":"add",
            "path":"/address",
            "value":"here"
          },
          {
            "op":"remove",
            "path":"/foo"
          }
        ]
      }
    },
    {
      "kind":"Order",
      "namespace":"default",
      "version":"v1",
      "latest":true,
      "description":"Everything about the Order entity",
      "names":{
        "plural":"orders",
        "singular":"order"
      },
      "schema":{
        "type":"object",
        "properties":{
          "uid":{
            "type":"string",
            "description":"id of the Order"
          }
        },
        "required":[
          "uid"
        ]
      },
      "migrationsFrom":{
        "v0":[
          {
            "op":"add",
            "path":"/address",
            "value":"here"
          },
          {
            "op":"remove",
            "path":"/foo"
          }
        ]
      }
    },
    {
      "kind":"Customer",
      "namespace":"default",
      "version":"v1",
      "latest":true,
      "description":"Everything about the Customer entity",
      "names":{
        "plural":"customers",
        "singular":"customer"
      },
      "schema":{
        "type":"object",
        "properties":{
          "uid":{
            "type":"string",
            "description":"id of the Customer"
          }
        },
        "required":[
          "uid"
        ]
      },
      "migrationsFrom":{
        "v0":[
          {
            "op":"add",
            "path":"/address",
            "value":"here"
          },
          {
            "op":"remove",
            "path":"/foo"
          }
        ]
      }
    }
  ]
}