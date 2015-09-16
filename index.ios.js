'use strict';

let React = require('react-native');
let {
  AppRegistry,
  DatePickerIOS,
  SliderIOS,
  SwitchIOS,
  StyleSheet,
  Text,
  ScrollView,
  View,
} = React;

let NeverUse = React.createClass({
  getInitialState: function () {
    let startDate = roundMinutes(new Date());
    let endDate = addHours(startDate, 1);

    let quiet = {
      startDate,
      endDate
    };

    return {
      enabled: false,
      quietTimes: [quiet],
      dingsPerHour: 1
    }
  },

  _onEnabledChange: function (toggle) {
    this.setState({ enabled: toggle });
  },

  _onTimeRangeChange: function (i, newTime) {
    let updateQuery = {};
    updateQuery[i] = { '$set': newTime };

    this.setState({
      quietTimes: React.addons.update(this.state.quietTimes, updateQuery)
    });
  },

  _onDingsPerHourChange: function (val) {
    this.setState({ dingsPerHour: Math.round(val) });
  },

  render: function() {
    return (
      <ScrollView>
        <View>
          <Text>Enabled</Text>
          <SwitchIOS
            onValueChange={this._onEnabledChange}
            value={this.state.enabled} />
        </View>
        <View>
          <Text>Quiet Times</Text>
          { 
            this.state.quietTimes.map((time, i) => {
              return ( 
                <TimeRangePicker 
                startDate={time.startDate}
                endDate={time.endDate}
                onTimeRangeChange={this._onTimeRangeChange.bind(this, i)}
                key={i} />
              );
            })
          }
        </View>
        <View>
          <Text>Dings Per Hour {this.state.dingsPerHour}</Text>
          <SliderIOS
            minimumValue={1}
            maximumValue={30}
            onValueChange={this._onDingsPerHourChange} />
        </View>
      </ScrollView>
    );
  },
});

let TimeRangePicker = React.createClass({
  propTypes: {
    startDate: React.PropTypes.instanceOf(Date),
    endDate: React.PropTypes.instanceOf(Date),
    onTimeRangeChange: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      startDate: this.props.startDate,
      endDate: this.props.endDate,
    };
  },

  _onStartDateChange: function(date) {
    this.setState({ startDate: date}, () => {
      this.props.onTimeRangeChange(this.state);
    });
  },

  _onEndDateChange: function(date) {
    this.setState({ endDate: date}, () => {
      this.props.onTimeRangeChange(this.state);
    });
  },

  render: function () {
    let startTimeLabel = 'Start Time: ' + 
                         this.state.startDate.toLocaleDateString() +
                         ' ' +
                         this.state.startDate.toLocaleTimeString();
    let endTimeLabel = 'End Time: ' +
                         this.state.endDate.toLocaleDateString() +
                         ' ' +
                         this.state.endDate.toLocaleTimeString();

    return (
        <View>
          <Heading label={startTimeLabel} />
          <DatePickerIOS
            date={this.state.startDate}
            mode="time"
            onDateChange={this._onStartDateChange}
            minuteInterval={10}
          />

          <Heading label={endTimeLabel} />
          <DatePickerIOS
            date={this.state.endDate}
            mode="time"
            onDateChange={this._onEndDateChange}
            minuteInterval={10}
            minimumDate={this.state.startDate}
          />
        </View>
    );
  }
});

let WithLabel = React.createClass({
  render: function() {
    return (
      <View style={styles.labelContainer}>
        <View style={styles.labelView}>
          <Text style={styles.label}>
            {this.props.label}
          </Text>
        </View>
        {this.props.children}
      </View>
    );
  }
});

let Heading = React.createClass({
  render: function() {
    return (
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>
          {this.props.label}
        </Text>
      </View>
    );
  }
});


let styles = StyleSheet.create({
  textinput: {
    height: 26,
    width: 50,
    borderWidth: 0.5,
    borderColor: '#0f0f0f',
    padding: 4,
    fontSize: 13,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  labelView: {
    marginRight: 10,
    paddingVertical: 2,
  },
  label: {
    fontWeight: '500',
  },
  headingContainer: {
    padding: 4,
    backgroundColor: '#f6f7f8',
  },
  heading: {
    fontWeight: '500',
    fontSize: 14,
  },
});

AppRegistry.registerComponent('NeverUse', () => NeverUse);


function addHours(originalDate, hours) {
  let date = new Date(originalDate.getTime());
  date.setHours(date.getHours()+hours);
  return date;
}

function roundMinutes(date) {
  date.setHours(date.getHours() + Math.round(date.getMinutes()/60));
  date.setMinutes(0);
  return date;
}