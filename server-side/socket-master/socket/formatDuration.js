function parseDuration(duration) {
    let remain = duration
  
    let days = Math.floor(remain / (1000 * 60 * 60 * 24))
    remain = remain % (1000 * 60 * 60 * 24)
  
    let hours = Math.floor(remain / (1000 * 60 * 60))
    remain = remain % (1000 * 60 * 60)
  
    let minutes = Math.floor(remain / (1000 * 60))
    remain = remain % (1000 * 60)
  
    let seconds = Math.floor(remain / (1000))
    remain = remain % (1000)
  
    let milliseconds = remain
  
    return {
      days,
      hours,
      minutes,
      seconds,
      milliseconds
    };
  }
  
  function formatTime(o, useMilli = false) {
    let parts = []
    if (o.days) {
      let ret = o.days + ' day'
      if (o.days !== 1) {
        ret += 's'
      }
      parts.push(ret)
    }
    if (o.hours) {
      let ret = o.hours + ' hour'
      if (o.hours !== 1) {
        ret += 's'
      }
      parts.push(ret)
    }
    if (o.minutes) {
      let ret = o.minutes + ' minute'
      if (o.minutes !== 1) {
        ret += 's'
      }
      parts.push(ret)
  
    }
    if (o.seconds) {
      let ret = o.seconds + ' second'
      if (o.seconds !== 1) {
        ret += 's'
      }
      parts.push(ret)
    }
    if (useMilli && o.milliseconds) {
      let ret = o.milliseconds + ' millisecond'
      if (o.milliseconds !== 1) {
        ret += 's'
      }
      parts.push(ret)
    }
    if (parts.length === 0) {
      return 'instantly'
    } else {
      return parts.join(' ')
    }
  }
  
  function formatTimeHMS(o) {
    let hours = o.hours.toString()
    if (hours.length === 1) hours = '0' + hours
  
    let minutes = o.minutes.toString()
    if (minutes.length === 1) minutes = '0' + minutes
  
    let seconds = o.seconds.toString()
    if (seconds.length === 1) seconds = '0' + seconds
  
    return hours + ":" + minutes + ":" + seconds
  }
  
  function formatDurationHMS(duration) {
    let time = parseDuration(duration)
    return formatTimeHMS(time)
  }
  
  function formatDuration(duration, useMilli = false) {
    let time = parseDuration(duration)
    return formatTime(time, useMilli)
  }
  module.exports = formatDuration