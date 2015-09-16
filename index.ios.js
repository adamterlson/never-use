'use strict';

var React = require('react-native');
var {
  AppRegistry,
  DatePickerIOS,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
} = React;

var NeverUse = React.createClass({
  getInitialState: function () {
    var startDate = roundMinutes(new Date());
    var endDate = addHours(startDate, 1);

    function addHours(originalDate, hours) {
      var date = new Date(originalDate.getTime());
      date.setHours(date.getHours()+hours);
      return date;
    }

    function roundMinutes(date) {
      date.setHours(date.getHours() + Math.round(date.getMinutes()/60));
      date.setMinutes(0);
      return date;
    }

    var quiet = {
      startDate,
      endDate,
      timeZoneOffsetInHours: (-1) * startDate.getTimezoneOffset() / 60
    };

    return {
      quietTimes: [quiet]
    }
  },

  render: function() {
    return (
      <ScrollView>
        <View>
          { 
            this.state.quietTimes.map((time, i) => {
              return ( <TimeRangePicker 
                startDate={time.startDate}
                endDate={time.endDate}
                timeZoneOffsetInHours={time.timeZoneOffsetInHours}
                key={i} /> )
            
            })
          }
        </View>
      </ScrollView>
    );
  },
});

var TimeRangePicker = React.createClass({
  propTypes: {
    startDate: React.PropTypes.instanceOf(Date),
    endDate: React.PropTypes.instanceOf(Date),
    timeZoneOffsetInHours: React.PropTypes.number,
    onTimeRangeChange: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      timeZoneOffsetInHours: this.props.timeZoneOffsetInHours
    };
  },

  onStartDateChange: function(date) {
    this.setState({ startDate: date});
  },

  onEndDateChange: function(date) {
    this.setState({ endDate: date});
  },

  render: function () {
    var startTimeLabel = 'Start Time: ' + 
              this.state.startDate.toLocaleDateString() +
              ' ' +
              this.state.startDate.toLocaleTimeString();
    var endTimeLabel = 'End Time: ' +
              this.state.endDate.toLocaleDateString() +
              ' ' +
              this.state.endDate.toLocaleTimeString();
    return (
        <View>
          <Heading label={startTimeLabel} />
          <DatePickerIOS
            date={this.state.startDate}
            mode="time"
            timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
            onDateChange={this.onStartDateChange}
            minuteInterval={10}
          />

          <Heading label={endTimeLabel} />
          <DatePickerIOS
            date={this.state.endDate}
            mode="time"
            timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
            onDateChange={this.onEndDateChange}
            minuteInterval={10}
            minimumDate={this.state.startDate}
          />
        </View>
    );
  }
});

var WithLabel = React.createClass({
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

var Heading = React.createClass({
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


var styles = StyleSheet.create({
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
