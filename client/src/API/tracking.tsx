export default class Tracker {
  constructor() {}
  clearSawtooth(
    path: [number, number][],
    x: number,
    ifPositive: boolean
  ): [number, number][] {
    const deleteIndicesSet = new Set();
    if (ifPositive) {
      for (let i = 1; i < path.length - 2; i += 2) {
        if (path[i][0] > x && path[i + 2][0] > x) {
          deleteIndicesSet.add(i + 1);
        }
      }
    } else {
      for (let i = 1; i < path.length - 2; i += 2) {
        if (path[i][0] < x && path[i + 2][0] < x) {
          deleteIndicesSet.add(i + 1);
        }
      }
    }
    const deleteIndicesList = Array.from(deleteIndicesSet).reverse();
    for (let i = 0; i < deleteIndicesList.length; i++) {
      path.splice(deleteIndicesList[i], 1);
    }
    return path;
  }

  extractPeaks(positivePath: [number, number][], x: number) {
    let peaks = [];
    let peakPoints = [];
    let findFlag = false;
    for (let i = 0; i < positivePath.length - 1; i++) {
      let point = positivePath[i];
      let nextPoint = positivePath[i + 1];
      if (point[0] === x && nextPoint[0] !== x) findFlag = true;
      if (point[0] !== x && nextPoint[0] === x) findFlag = false;
      if (findFlag === true) {
        peakPoints.push(point);
      } else if (findFlag === false && peakPoints.length > 0) {
        let peakInfo = {
          x: 0,
          pos: -1,
          value: -1
        };
        peakPoints.map(e => {
          if (e[0] > peakInfo.x) {
            peakInfo.x = e[0];
            peakInfo.pos = e[1];
            peakInfo.value = e[0] - x;
          }
        });
        let peak = {
          top: peakPoints[0][1],
          bottom: peakPoints[peakPoints.length - 1][1],
          mid: (peakPoints[0][1] + peakPoints[peakPoints.length - 1][1]) / 2,
          peak: peakInfo.pos,
          x: peakInfo.x,
          value: peakInfo.value
        };
        peaks.push(peak);
        peakPoints = [];
      }
    }
    return peaks;
  }

  cutOffAllTracks(allTracks: any, traceCount: number) {
    for (let i = allTracks.length - 1; i >= 0; i--) {
      if (allTracks[i].length < traceCount / 2) {
        allTracks.splice(i, 1);
      }
    }
    let removeSet = new Set();
    for (let i = 0; i < allTracks.length; i++) {
      labelStop: for (let j = 0; j < allTracks.length; j++) {
        if (i === j) continue;
        let track1 = allTracks[i];
        let track2 = allTracks[j];
        if (track1.length === track2.length) continue;
        for (let s = 1; s < track1.length; s++) {
          for (let m = 1; m < track2.length; m++) {
            if (
              track1[s].mid === track2[m].mid &&
              track1[s].x === track2[m].x &&
              track1[s - 1].mid !== track2[m - 1].mid
            ) {
              if (track1.length < track2.length) {
                removeSet.add(i);
                break labelStop;
              } else {
                removeSet.add(j);
                break labelStop;
              }
            }
          }
        }
      }
    }
    let removeList = Array.from(removeSet).sort((a, b) => b - a);
    for (let i = 0; i < removeList.length; i++) {
      allTracks.splice(removeList[i], 1);
    }
  }

  tracking(allPeaks: any, startTrackNumber: number) {
    const allTracks = [];
    for (let i = 0; i < allPeaks[startTrackNumber].length; i++) {
      let track = [allPeaks[startTrackNumber][i]];
      for (let j = startTrackNumber + 1; j < allPeaks.length; j++) {
        let nextPeak = null;
        let MaxOffSet = 999;
        for (let s = 0; s < allPeaks[j].length; s++) {
          let offset = Math.abs(
            allPeaks[j][s].mid - track[track.length - 1].mid
          );
          if (offset < MaxOffSet) {
            MaxOffSet = offset;
            nextPeak = allPeaks[j][s];
          }
        }
        //if offsets too much,stop here
        if (MaxOffSet > 50) break;
        track.push(nextPeak);
      }
      allTracks.push(track);
    }
    cutoff(allTracks);
    return allTracks;

    function cutoff(allTracks: any[]) {
      for (let i = 0; i < allTracks.length - 1; i++) {
        for (let j = 0; j < allTracks[i].length; j++) {
          if (!allTracks[i + 1][j]) continue;
          let curTrack = allTracks[i];
          let nextTrack = allTracks[i + 1];
          if (curTrack[j].mid !== nextTrack[j].mid) continue;
          let curOffSet = Math.abs(curTrack[j].mid - curTrack[j - 1].mid);
          let nextOffSet = Math.abs(nextTrack[j].mid - nextTrack[j - 1].mid);
          let curValueDiff = Math.abs(
            curTrack[j].value - curTrack[j - 1].value
          );
          let nextValueDiff = Math.abs(
            nextTrack[j].value - nextTrack[j - 1].value
          );
          let curDiff = 0.5 * curOffSet + 0.5 * curValueDiff;
          let nextDiff = 0.5 * nextOffSet + 0.5 * nextValueDiff;
          if (curDiff < nextDiff) {
            allTracks[i + 1].splice(j, allTracks[i + 1].length - j);
          } else {
            allTracks[i].splice(j, allTracks[i].length - j);
          }
        }
      }
    }
  }
}
