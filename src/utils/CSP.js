/**
 * Defines a constraint satisfaction problem
 * @class
 */
class CSP {
  constructor() {
    this.FAILURE = "FAILURE";
    this.stepCounter = 0;
  }

  /**
   * Solves a constraint satisfaction problem
   * @function
   * @param {object} csp - CSP object
   */
  solve(csp) {
    csp.timeStep = csp.timeStep || 1;

    const result = this.backtrack({}, csp.variables, csp);

    if (result === this.FAILURE) {
      return result;
    }

    for (let key in result) {
      result[key] = result[key][0];
    }

    return result;
  }

  /**
   * Backtracking search
   * @function
   * @param {object} _assigned - Assigned variables object
   * @param {object} unassigned - Unassigned variables object
   * @param {object} csp - CSP object
   */
  backtrack(_assigned, unassigned, csp) {
    const assigned = {};

    for (let key in _assigned) {
      assigned[key] = _assigned[key];
    }

    if (this.finished(unassigned)) {
      return assigned;
    }

    let nextKey = this.selectUnassignedVariable(unassigned);
    let values = this.orderValues(nextKey, assigned, unassigned, csp);

    delete unassigned[nextKey];

    for (let i = 0; i < values.length; i++) {
      this.stepCounter++;
      assigned[nextKey] = [values[i]];

      const consistent = this.enforceConsistency(assigned, unassigned, csp);
      const newUnassigned = {};
      const newAssigned = {};

      for (let key in consistent) {
        if (assigned[key]) {
          newAssigned[key] = assigned[key].slice();
        } else {
          newUnassigned[key] = consistent[key].slice();
        }
      }

      if (csp.callback) {
        setTimeout(
          ((newAssigned, newUnassigned) => {
            return function () {
              csp.callback(newAssigned, newUnassigned, csp);
            };
          })(newAssigned, newUnassigned),
          this.stepCounter * csp.timeStep
        );
      }

      if (this.anyEmpty(consistent)) {
        continue;
      }

      const result = this.backtrack(newAssigned, newUnassigned, csp);

      if (result !== this.FAILURE) {
        return result;
      }
    }

    return this.FAILURE;
  }

  /**
   * Check if there are no variables left to assign
   * @function
   * @param {object} unassigned - Unassigned variables object
   */
  finished(unassigned) {
    return Object.keys(unassigned).length === 0;
  }

  /**
   * Checks if there is a variable with an empty domain
   * @function
   * @param {object} consistent - Consistent object
   */
  anyEmpty(consistent) {
    for (let key in consistent) {
      if (consistent[key].length === 0) {
        return true;
      }
    }

    return false;
  }

  /**
   * Combine assigned and unassigned variables to enforce consistency
   * @function
   * @param {object} assigned - Assigned variables object
   * @param {object} unassigned - Unassigned variables object
   */
  partialAssignment(assigned, unassigned) {
    const partial = {};

    for (let key in unassigned) {
      partial[key] = unassigned[key].slice();
    }

    for (let key in assigned) {
      partial[key] = assigned[key].slice();
    }

    return partial;
  }

  /**
   * Enforce arc consistency by removing inconsistent values
   * @function
   * @param {object} assigned - Assigned variables object
   * @param {object} unassigned - Unassigned variables object
   * @param {object} csp - CSP object
   */
  enforceConsistency(assigned, unassigned, csp) {
    const removeInconsistentValues = (head, tail, constraint, variables) => {
      let headVariables = variables[head];
      let tailVariables = variables[tail];

      const validTailValues = tailVariables.filter((tv) =>
        headVariables.some((hv) => constraint(hv, tv))
      );
      const removed = tailVariables.length !== validTailValues.length;
      variables[tail] = validTailValues;

      return removed;
    };

    const incomingConstraints = (node) =>
      csp.constraints.filter((constraint) => constraint[0] === node);

    let queue = csp.constraints.slice();
    let variables = this.partialAssignment(assigned, unassigned);

    while (queue.length) {
      let shift = queue.shift();
      let [head, tail, constraint] = shift;

      if (removeInconsistentValues(head, tail, constraint, variables)) {
        queue = queue.concat(incomingConstraints(tail));
      }
    }

    return variables;
  }

  /**
   * Selects the next variable to assign based on MRV
   * @function
   * @param {object} unassigned - Unassigned variables object
   */
  selectUnassignedVariable(unassigned) {
    let minKey = null;
    let minLen = Number.POSITIVE_INFINITY;

    for (let key in unassigned) {
      let len = unassigned[key].length;

      if (len < minLen) {
        minKey = key;
        minLen = len;
      }
    }

    return minKey;
  }

  /**
   * Orders the values of an unassigned variable based on LCV
   * @function
   * @param {string} nextKey - Next key
   * @param {object} assigned - Assigned variables object
   * @param {object} unassigned - Unassigned variables object
   * @param {object} csp - CSP object
   */
  orderValues(nextKey, assigned, unassigned, csp) {
    const countValues = (variables) => {
      let count = 0;

      for (let key in variables) {
        count += variables[key].length;
      }

      return count;
    };

    const valuesEliminated = (value) => {
      assigned[nextKey] = [value];
      const newLen = countValues(
        this.enforceConsistency(assigned, unassigned, csp)
      );
      delete assigned[nextKey];

      return newLen;
    };

    const cache = {};
    const values = unassigned[nextKey];

    values.forEach((value) => {
      cache[value] = valuesEliminated(value);
    });
    values.sort((a, b) => cache[b] - cache[a]);

    return values;
  }
}

export default CSP;
