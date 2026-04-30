export type Country = {
	name: string
	isoCode: string
	flag: string
	currency?: string
}

export type State = {
	name: string
	isoCode: string
	countryCode: string
}

export type City = {
	name: string
	stateCode: string
	countryCode: string
}

export type PickerSelection = {
	country: Country | null
	state: State | null
	city: City | null
}
