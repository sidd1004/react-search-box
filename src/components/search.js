import React, { Component } from 'react';

import input from '../input';

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ''
        }
    }

    fuzzySearch() {
        let textBoxInput = this.state.inputValue;
        textBoxInput = textBoxInput.toUpperCase();
        let filteredArray = [];
        if (this.state.inputValue !== '') {
            input.forEach((eachUser) => {
                for (const key in eachUser) {
                    if (eachUser.hasOwnProperty(key)) {
                        if (!Array.isArray(eachUser[key])) {
                            if (((eachUser[key]).toUpperCase()).includes(textBoxInput)) {
                                filteredArray.push(eachUser);
                            }
                        }
                        else {
                            eachUser[key].forEach((arrayElem) => {
                                if (arrayElem.toUpperCase().includes(textBoxInput)) {
                                    filteredArray.push(eachUser);
                                }
                            })
                        }
                    }
                }
            });
        }
        return filteredArray;
    };

    generateDropDown = () => {
        const filteredArray = this.fuzzySearch();
        if (filteredArray.length !== 0) {
            return filteredArray.map((eachObj, index) => {
                return (
                    <li className="list-elements" key={index} onClick={e => this.selectList(e, eachObj)} onMouseOver={e => this.handleHover(e, eachObj, index)} onKeyDown={e => this.handleKeyboard(e, eachObj, index)} ref={`li${index}`} tabIndex={0}>
                        <div>ID: {eachObj['id']}</div>
                        <div>Name: {eachObj['name']}</div>
                        <div>Items: {eachObj['items']}</div>
                        <div>Address: {eachObj['address']}</div>
                        <div>Pincode: {eachObj['pincode']}</div>
                    </li>
                )
            });
        }
        else if (filteredArray.length === 0 && this.state.inputValue !== '') {
            return (
                <div className="no-list-elements">No Results Found</div>
            )
        }
        else {
            return null;
        }
    }

    handleInputChange(e) {
        e.preventDefault();
        this.setState({ inputValue: e.target.value, finalList: '' });
    }

    selectList(e, eachObj) {
        e.preventDefault();
        this.setState({ finalList: eachObj, inputValue: '' });

    }

    generateSelectedList() {
        if (this.state.finalList === undefined || this.state.finalList === '') {
            return null;
        }
        else {
            return (
                <div>
                    <div>ID: {this.state.finalList['id']}</div>
                    <div>Name: {this.state.finalList['name']}</div>
                    <div>Items: {this.state.finalList['items']}</div>
                    <div>Address: {this.state.finalList['address']}</div>
                    <div>Pincode: {this.state.finalList['pincode']}</div>
                </div>
            )
        }
    }

    handleHover(e, eachObj, index) {
        e.preventDefault();
        this.currentIndex = index;
        const currentListRef = `li${this.currentIndex}`;
        this.refs[currentListRef].focus();
    }

    handleKeyboard(e, eachObj, index) {
        this.currentIndex = index;
        if (e.keyCode === 13) {
            this.selectList(e, eachObj);
        }
        if (e.keyCode === 40) {
            const nextListRef = `li${this.currentIndex + 1}`;
            if (this.refs[nextListRef] !== undefined)
                this.refs[nextListRef].focus();
        }
        if (e.keyCode === 38) {
            const prevListRef = `li${this.currentIndex - 1}`;
            if (this.refs[prevListRef] !== undefined)
                this.refs[prevListRef].focus();
        }
    }

    handleInputKey(e) {
        if (e.keyCode === 40) {
            if (this.refs.li0) {
                this.currentIndex = 1;
                this.refs.li0.focus();
            }
            else
                this.refs.filteredUnList.focus();
        }
    }

    render() {
        return (
            <main>
                <section className="search-container">
                    <input type="text" id="dropdown-search" className="input-text" value={this.state.inputValue} onChange={e => this.handleInputChange(e)} placeholder="Enter to start search" onKeyDown={e => this.handleInputKey(e)} />
                    <ul className={this.state.inputValue === undefined || this.state.inputValue === '' ? '' : "results-list"} tabIndex={0} ref="filteredUnList">{this.generateDropDown()}</ul>
                </section>
                <section className="selected-card">
                    {this.state.finalList !== undefined ? this.generateSelectedList() : ''}
                </section>
            </main>
        )
    }
}