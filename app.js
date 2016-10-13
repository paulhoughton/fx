angular.module("fx.app", [])
.component("fxDirection", {
  bindings: { val: "<" },
  template: `
    <span
      ng-if="$ctrl.val!==undefined"
      ng-style={color:$ctrl.val?'green':'red'}>
        {{$ctrl.val?"&#x25b2;":"&#x25bc;"}}
      </span>`
})
.component("fxRow", {
  bindings: {
    currencyPair: "<",
    bidBig: "<",
    bidPips: "<",
    updated: "<"
  },
  template: `
  <div>
    <span class="currency">{{$ctrl.currencyPair}}</span>
    <span class="value" ng-class="{changed:$ctrl.changed}">
      {{$ctrl.bidBig}}<sup>{{$ctrl.bidPips}}</sup>
    </span>
    <fx-direction val="$ctrl.direction"></direction>
  </div>`,
  controller: class {
    $onChanges(changes) {
      if (this.changed = (!!(changes.bidPips) && !changes.bidPips.isFirstChange())) {
        this.direction = +(this.bidBig + this.bidPips) > +((changes.bidBig||this.bidBig) + changes.bidPips.previousValue)
      }
    }
  }
})
.component("fxTable", {
  template: `
    <fx-row 
      ng-repeat="row in $ctrl.data track by row.currencyPair" 
      currency-pair="row.currencyPair"
      bid-big="row.bidBig"
      bid-pips="row.bidPips"
      updated="$ctrl.updated"}>
    </fx-row>`,
  bindings: {
    src: "@"
  },
  controller: function ($scope) {
    this.$onInit = function () {
      io(this.src).on('data', data => $scope.$apply(() => {
        this.updated = +new Date();
        this.data = data;
      }))
    }
  }
})
