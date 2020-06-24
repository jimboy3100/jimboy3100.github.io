//by DAVI すべての最強!
window.externalScriptMassBarTemp=0
var defaultSettings;

class MassBar {
    constructor() {
        this.querys()

        this.buildElements()
        this.setStyleToElements()
        this.setClassToElements()
    }

    querys() {
        this.players         = document.getElementsByClassName('top5-mass-color')
        this.topTotalPlayers = document.getElementById('top5-total-players')

        this.topTotalMass    = document.getElementById('top5-total-mass')
        this.massesBar       = document.getElementsByClassName('mass-bar')
    }

    bringPlayersMass() {
        this.topMassLeaderboard =  Array.prototype.map.call(this.players, (mass, index) => {
            const calculatedMass = mass.innerText.match(/[k]/)
            ?
                Number(mass.innerText.match(/[0-9\.]/g).join('')) * 1000
            :
                Number(mass.innerText.match(/[0-9]/g).join(''))
        
            if (index < Number(this.topTotalPlayers.innerText)) {
                return calculatedMass
            }
        })
        .filter(mass => mass != undefined)
    }

    buildElements() {
        this.massBarContainer = document.createElement('div')
        this.massBar          = document.createElement('div')
    }

    setStyleToElements() {		
		if (defaultSettings && defaultSettings.top5MassColor && defaultSettings.menuPanelColor2){ 
			this.massBarContainer.setAttribute('style', 'background-color: ' + defaultSettings.menuPanelColor2 + '; display: block; position: relative; margin-bottom: 3px;')
			this.massBar.setAttribute('style', 'background-color: ' + defaultSettings.top5MassColor + '; width: 0%; height: 100%; max-width: 190px; left: 0px; top: 0px; position: absolute;')
		}
        else{
			this.massBarContainer.setAttribute('style', 'background-color: #202020; display: block; position: relative; margin-bottom: 3px;')
			this.massBar.setAttribute('style', 'background-color: #01d9cc; width: 0%; height: 100%; max-width: 190px; left: 0px; top: 0px; position: absolute;')
		}       
    }

    setClassToElements() {
        this.massBarContainer.className = 'hud'
        this.massBar.className          = 'mass-bar'
    }

    buildMassHud() {
        this.massBarContainer.appendChild(this.massBar)
        const rankOositions = document.getElementById('top5-pos').getElementsByTagName('li')
		
        if (document.getElementsByClassName('mass-bar')[0] == undefined) {
            Array.prototype.forEach.call(rankOositions, rank => {
				window.externalScriptMassBar[window.externalScriptMassBarTemp]=this.massBarContainer.outerHTML
                //rank.insertAdjacentHTML('afterend', this.massBarContainer.outerHTML)
				window.externalScriptMassBarTemp++
            })
			
        }
    }
    
    setPercentage() {
        const calculatedMass = this.topTotalMass.innerText.match(/[k]/) != null
            ?
                Number(this.topTotalMass.innerText.match(/[0-9\.]/g).join('')) * 1000
            :
                Number(this.topTotalMass.innerText.match(/[0-9]/g).join(''))


        Array.prototype.forEach.call(this.massesBar, (massBar, index) => {
            massBar.style.width =  this.topMassLeaderboard[index] / calculatedMass * 100 + '%'
        })
    }
}

let massBar = new MassBar()

let observer = new MutationObserver(_ => {
    massBar.bringPlayersMass()
    massBar.setPercentage()
})

let analysis = {
    childList: true
}

setTimeout(function() {
let elementObserved = document.getElementById('top5-total-mass')
observer.observe(elementObserved, analysis)

 setInterval(_ => {
    massBar.buildMassHud()
    massBar.bringPlayersMass()
    massBar.setPercentage()
}) 
}, 5000);
