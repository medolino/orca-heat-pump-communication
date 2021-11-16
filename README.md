# ORCA Heat Pump Communication

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

**ORCA Heat Pump Communication** is a communication helper which enables you to read and write tags from/to ORCA Heap Pump devices. It was specifically developed for [DUO 300](https://si.orcaenergy.eu/ogrevalne-toplotne-crpalke/duodouble-300-duodouble-300-solar-nizkotemperaturna/) model, but I presume it should also work with other models.

## How It Works

`orca-heat-pump-communication` communicates with Heat Pump device via exposed `cgi` api.
After initialization `readTags` and `writeTags` functions are exposed, which enables you to read and write tag values.

## Install

```bash
npm i orca-heat-pump-communication --save
```

## Usage

```js
const Orca = require('orca-heat-pump-communication')

const settings = {
  host: '192.168.1.111',
  username: 'username',
  password: 'password'
}

const {
  readTags,
  writeTags
} = Orca(settings)

// read tag values
const tags = ['2_Temp_prostor_dnevna', '2_Temp_Zunanja']

readTags(tags)
  .then(res => console.log(res)) // [{ tag: '2_Temp_prostor_dnevna', status: 'S_OK', value: 22.5 }, ...]
  .catch(err => console.error(err))

// write tag values
const tagValues = [
  { name: '2_Temp_prostor_dnevna', value: 22.5 },
  { name: '2_Temp_Zunanja', value: 5.7 }
]

writeTags(tagValues)
  .then((res) => console.log(res)) // [{ tag: '2_Temp_prostor_dnevna', status: 'S_OK', value: 22.5 }, ...]
  .catch(err => console.error(err))
```

## API

* [Orca(settings) => orca-communication](#export)
  * [settings](#orcaSettings)
* [Orca Instance](#orcaCommunication)
  * [orca.readTags(tags)](#orcaCommunicationReadTags)
  * [orca.writeTags(values)](#orcaCommunicationWriteTags)

<a id="export"></a>
### `Orca(settings) => orcaCommunication`

The exported `Orca` function takes [`settings`](#orcaSettings) argument and returns [orca-communication instance](#orcaCommunication).

<a id=orcaSettings></a>
### `settings` (Object)

#### `host` (String)

Heat pump host.

Required: `true`

#### `username` (String)

Heat pump cgi api authentication username.

Required: `true`

#### `password` (String)

Heat pump cgi api authentication password.

Required: `true`

<a id="orcaCommunication"></a>
### `Orca Communication Instance`

The Orca Communication instance is the object returned by the main exported Orca function.

The primary purpose of the instance is to provide communication methods.

<a id=orcaCommunicationReadTags></a>
#### orca.readTags(tags)

Read values of provided tags.

##### tags

Array of tag names.

Type: `String[]`

Example: `['2_Temp_prostor_dnevna', '2_Temp_Zunanja']`

<a id=orcaCommunicationWriteTags></a>
#### orca.writeTags(values)

Write provided tag values.

##### values

Array of tag values.

Type: `Object[]`

Example: 
```js
[
  { name: '2_Temp_prostor_dnevna', value: 22.5 },
  { name: '2_Temp_Zunanja', value: 5.7 }
]
````
