  //angular
  var app = angular.module("MyApp", []);
  app.controller("appController", ($scope) => {
      $scope.run = () => {
          var data = [];
          var start = parseInt($("#loan_year05").val()) + 1;
          var yearlyPayment = parseFloat($("#yearlyPayment").val());
          var yearlyInterest = parseFloat($("#loan_int05").val());

          var prevBalance = parseFloat(removeCommas($("#loan_bal05").html()));
          var i = 0;
          var limit = false;
          while (yearlyPayment < prevBalance && !limit) {
              var object = {};
              object.year = start + i;

              if (i == 0) {
                  object.intAmt = ((parseFloat(removeCommas($("#loan_bal05").html())) -
                      yearlyPayment) * yearlyInterest).toFixed(2);
                  object.balance = ((parseFloat(removeCommas($("#loan_bal05").html())) -
                      yearlyPayment) * (yearlyInterest + 1)).toFixed(2);
                  object.yearlyPayment = yearlyPayment;
              } else {
                  object.intAmt = ((data[i - 1].balance - yearlyPayment) * yearlyInterest).toFixed(2);
                  object.balance = ((data[i - 1].balance - yearlyPayment) * (yearlyInterest + 1))
                      .toFixed(2);
                  object.yearlyPayment = yearlyPayment;
              }

              prevBalance = object.balance;
              data.push(object);
              i++;
              if (i == 20) limit = true;
          }

          
          if (!limit) {
              var object = {};
              object.year = start + i;
              object.intAmt = 0;
              object.balance = 0;
              //if yearly payment is greater than first balance on loan the loop will not run leaving i == 0
              if (i == 0) object.yearlyPayment = prevBalance;
              else object.yearlyPayment = data[i - 1].balance;
              data.push(object);
          }

          //add commas after data parsing is over
          for (i = 0; i < data.length; i++) {
              data[i].yearlyPayment = "$" + toComma(data[i].yearlyPayment);
              data[i].intAmt = "$" + toComma(data[i].intAmt);
              data[i].balance = "$" + toComma(data[i].balance);
          }

          $scope.data = data;
          $scope.limit = limit;
      };
  });
  //end of angular

  // --- global variables ---

  var loans = [{
      loan_year: 2020,
      loan_amount: 10000.00,
      loan_int_rate: 0.0453
  }, {
      loan_year: 2021,
      loan_amount: 10000.00,
      loan_int_rate: 0.0453
  }, {
      loan_year: 2022,
      loan_amount: 10000.00,
      loan_int_rate: 0.0453
  }, {
      loan_year: 2023,
      loan_amount: 10000.00,
      loan_int_rate: 0.0453
  }, {
      loan_year: 2024,
      loan_amount: 10000.00,
      loan_int_rate: 0.0453
  }];

  // --- function: loadDoc() ---

  $(document).ready(() => {
      // pre-fill defaults for first loan year
      var defaultYear = loans[0].loan_year;
      $("#loan_year01").val(defaultYear++);

      var defaultLoanAmount = loans[0].loan_amount;
      $("#loan_amt01").val(defaultLoanAmount.toFixed(2));

      var defaultInterestRate = loans[0].loan_int_rate;
      $("#loan_int01").val(defaultInterestRate);

      var loanWithInterest = loans[0].loan_amount * (1 + loans[0].loan_int_rate);
      $("#loan_bal01").html(toComma(loanWithInterest.toFixed(2)));

      // pre-fill defaults for other loan years
      for (var i = 2; i < 6; i++) {
          $("#loan_year0" + i).val(defaultYear++);
          $("#loan_year0" + i).prop("disabled", true);
          $("#loan_year0" + i).css({
              "backgroundColor": "gray",
              "color": "white"
          });

          $("#loan_amt0" + i).val(defaultLoanAmount.toFixed(2));

          $("#loan_int0" + i).val(defaultInterestRate);
          $("#loan_int0" + i).prop("disabled", true);
          $("#loan_int0" + i).css({
              "backgroundColor": "gray",
              "color": "white"
          });
      } // end: "for" loop

      // all input fields: select contents on focus
      $("input[type=text]").focus(function () {
          $(this).select();
          $(this).css("background-color", "yellow");
      }).blur(function () {
          $(this).css("background-color", "white");

          if (validData()) {
              calculateInterest();
              //run angular
              $("#calc-button").trigger("click");
              //save user inputs
              saveData();
          } else {
              window.alert("Invalid Data!");
          }
      });

      // set focus to first year: messes up codepen
      $("#loan_year01").focus();
      $("#loan_year01").blur(function () {
          updateLoansArray();
      });

      calculateInterest();
      //set default yearly payment
      $("#yearlyPayment").val(6500.00);
      //run angular
      $("#calc-button").trigger("click");

      //if data saved then use it
      if (localStorage.getItem("data")) {
          loadData();
      }

  }); // end: function loadDoc()

  function validData() {
      var posFloats = /^(?:[1-9]\d*|0)?(?:\.\d+)?$/;
      var posFloatsNoZero = /^(?:[1-9]\d*)?(?:\.\d+)?$/;
      var posInts = /^[1-9]\d*$/;

      if (!$("#loan_year01").val().match(posInts)) return false;
      if (!$("#loan_int01").val().match(posFloats)) return false;
      if (!$("#yearlyPayment").val().match(posFloatsNoZero)) return false;
      for (var i = 1; i < 6; i++) {
          if (!$("#loan_amt0" + i).val().match(posFloats)) return false;
      }

      return true;
  }

  function loadData() {
      var data = JSON.parse(localStorage.getItem("data"));
      $("#loan_year01").val(data.year);
      $("#loan_int01").val(data.intRate);

      for (var i = 0; i < data.amounts.length; i++) {
          $("#loan_amt0" + (i + 1)).val(data.amounts[i]);
      }

      $("#yearlyPayment").val(data.yearlyPayment);
      calculateInterest();
      //run angular
      $("#calc-button").trigger("click");
  }

  function saveData() {
      var data = {};
      data.year = parseInt($("#loan_year01").val());
      data.intRate = parseFloat($("#loan_int01").val());

      var amounts = [];
      for (var i = 1; i < 6; i++) {
          amounts.push(parseFloat($("#loan_amt0" + i).val()));
      }
      data.amounts = amounts;
      data.yearlyPayment = parseFloat($("#yearlyPayment").val())
      localStorage.setItem("data", JSON.stringify(data));
  }

  function calculateInterest() {
      var i = 1;

      var totalLoaned = parseFloat($("#loan_amt0" + i).val());

      var value = $("#loan_amt0" + i).val() * (1 + parseFloat($("#loan_int0" + i).val()));
      $("#loan_bal0" + i).html(toComma(value.toFixed(2)));

      for (i = 2; i < 6; i++) {
          $("#loan_int0" + i).val($("#loan_int01").val());

          var value = (parseFloat(removeCommas($("#loan_bal0" + (i - 1)).html())) + parseFloat($("#loan_amt0" +
              i).val())) * (1 + parseFloat($("#loan_int0" + i).val()));
          $("#loan_bal0" + i).html(toComma(value.toFixed(2)));
          totalLoaned += parseFloat($("#loan_amt0" + i).val());
      }

      var graduationBalance = parseFloat(removeCommas($("#loan_bal05").html()));

      $("#loan_int_accrued").html(toComma((graduationBalance - totalLoaned).toFixed(2)));
  }

  function toComma(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function removeCommas(value) {
      while (value.includes(",")) {
          value = value.replace(",", "");
      }

      return value;
  }

  function updateLoansArray() {
      loans[0].loan_year = parseInt($("#loan_year01").val());
      for (var i = 1; i < 5; i++) {
          loans[i].loan_year = loans[0].loan_year + i;
          $("#loan_year0" + (i + 1)).val(loans[i].loan_year);
      }
  }