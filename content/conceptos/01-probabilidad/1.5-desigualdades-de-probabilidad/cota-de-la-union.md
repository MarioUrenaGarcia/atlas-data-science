---
id: cota-de-la-union
titulo: Cota de la unión
titulo_en: Union bound
alias:
  - desigualdad de Boole
  - subaditividad
  - cota de Bonferroni de primer orden
modulo: 1
submodulo: '1.5'
orden: 7
nivel: intermedio
prerrequisitos:
  - probabilidad-de-la-union-de-eventos
relaciones:
  - tipo: relacionado
    id: paradoja-del-cumpleanos
etiquetas:
  - unión de eventos
  - desigualdad de Boole
  - pruebas múltiples
  - peor caso
resumen: >
  La probabilidad de que ocurra al menos uno de varios eventos es a lo más la suma de sus
  probabilidades. No requiere independencia y es casi exacta cuando los eventos rara vez ocurren
  juntos.
formula: 'P\Big(\bigcup_{i=1}^{m} A_i\Big) \le \sum_{i=1}^{m} P(A_i)'
visualizacion:
  componente: InequalityBound
  parametros:
    modo: union
    personas: 23
referencias:
  - clave: blitzstein-hwang
  - clave: ross-probabilidad
publicado: true
---

## Intuición

Si un avión tiene tres sistemas que fallan con probabilidades 0.001, 0.002 y 0.003, ¿qué tan probable es que falle alguno? Sin saber cómo se relacionan las fallas, no se puede dar el número exacto, pero sí una cota: a lo más $0.001 + 0.002 + 0.003 = 0.006$. Sumar las probabilidades cuenta dos veces los casos en que fallan dos sistemas a la vez, así que el resultado nunca se queda corto.

Esa es la **cota de la unión**, también llamada desigualdad de Boole. Es tosca cuando los eventos se traslapan mucho, pero tiene dos virtudes: no necesita independencia ni ninguna otra información sobre la relación entre los eventos, y es casi exacta cuando los eventos son raros, porque entonces sus intersecciones son todavía más raras.

## Definición

:::teorema[Cota de la unión]
Para eventos cualesquiera $A_1, \dots, A_m$,
$$
P\Big(\bigcup_{i=1}^{m} A_i\Big) \le \sum_{i=1}^{m} P(A_i).
$$
La desigualdad vale también para una sucesión infinita de eventos.
:::

Para dos eventos es la fórmula de la unión sin el término $-P(A \cap B)$, que es no negativo. Para más eventos se prueba por inducción, o escribiendo la unión como unión de eventos disjuntos $A_i \setminus (A_1 \cup \dots \cup A_{i-1})$, cada uno contenido en $A_i$.

:::figura[Diez personas: hay 45 parejas y cada una comparte cumpleaños con probabilidad 1/365. La suma, 0.123, apenas supera la probabilidad exacta, 0.117.]{componente="InequalityBound"}
```yaml
modo: union
personas: 10
```
:::

:::nota[Qué significa cada símbolo]
- $A_1, \dots, A_m$: eventos.
- $\bigcup_i A_i$: ocurre al menos uno.
- $P(A_i)$: probabilidad de cada evento.
- $A_{ij}$: las personas $i$ y $j$ cumplen años el mismo día.
- $\binom{n}{2}$: número de parejas entre $n$ personas; $d$: número de fechas posibles.
- $\alpha$: nivel de significancia global; $m$: número de pruebas o de eventos.
- $A_i \cap A_j$: ocurren $A_i$ y $A_j$ a la vez; $A_i \setminus B$: ocurre $A_i$ y no $B$.
:::

## Cómo usar la visualización

Con $n$ personas y 365 fechas, el evento "alguna pareja comparte cumpleaños" es la unión de $\binom{n}{2}$ eventos, uno por pareja, cada uno con probabilidad 1/365. La gráfica muestra la probabilidad exacta y la suma $\binom{n}{2}/365$ como funciones de $n$; el encabezado compara los dos números para el $n$ actual. Con 23 personas, la probabilidad exacta es 0.507 y la cota 0.693.

La deslizadera cambia $n$. Al principio las dos curvas casi coinciden; desde unas 28 personas la suma pasa de 1 y deja de informar, aunque la probabilidad exacta sigue creciendo hacia 1.

## Ejemplo

Un laboratorio etiqueta 10 muestras con un código elegido al azar, de manera independiente y uniforme, entre 100 códigos posibles. Interesa la probabilidad de que dos muestras reciban el mismo código.

1. Hay $\binom{10}{2} = 45$ parejas de muestras, y cada pareja coincide con probabilidad 1/100.
2. Cota de la unión: $P(\text{alguna coincidencia}) \le 45/100 = 0.45$.
3. Probabilidad exacta: $1 - \frac{100 \cdot 99 \cdots 91}{100^{10}} \approx 0.372$.
4. La cota inferior de Bonferroni resta las intersecciones de dos parejas, cada una con probabilidad $1/100^2$: $0.45 - \binom{45}{2}/100^2 = 0.45 - 0.099 = 0.351$. La probabilidad exacta queda entre 0.351 y 0.45.

:::figura[El ejemplo de los códigos: con 10 muestras y 100 códigos, la suma de las 45 probabilidades, 0.45, empieza a separarse de la probabilidad exacta, 0.372, porque las coincidencias de varias parejas a la vez ya no son despreciables.]{componente="InequalityBound"}
```yaml
modo: union
personas: 10
dias: 100
contexto: Cada persona representa una muestra y cada fecha uno de los 100 códigos.
```
:::

## Propiedades

- **Sin supuestos:** no requiere independencia; vale para eventos con cualquier relación.
- **Exacta para eventos excluyentes:** si los eventos no se traslapan, la cota es una igualdad.
- **Bonferroni:** las sumas alternadas de inclusión y exclusión dan cotas cada vez más finas, alternando entre superiores e inferiores; la primera inferior es $\sum_i P(A_i) - \sum_{i<j} P(A_i \cap A_j) \le P(\bigcup_i A_i)$.
- **Uso típico:** convierte una cota para un solo evento en una cota uniforme para muchos, como en las pruebas múltiples o en el aprendizaje estadístico con un número finito de hipótesis. Con 20 pruebas a nivel 0.05 la cota da 1 y no dice nada; con nivel $0.05/20 = 0.0025$ en cada una, la probabilidad de algún falso positivo queda debajo de 0.05 sin importar cómo se relacionen las pruebas: es la corrección de Bonferroni.

:::figura[Cinco personas: las 10 parejas casi nunca coinciden a la vez, y la suma, 0.0274, coincide con la probabilidad exacta, 0.0271, en tres cifras.]{componente="InequalityBound"}
```yaml
modo: union
personas: 5
```
:::

## Errores comunes

- **Usarla cuando la suma pasa de 1.** La cota se vuelve trivial; hay que usar información sobre las intersecciones o el complemento.
- **Confundirla con la regla de la suma.** Sumar probabilidades da la probabilidad exacta solo si los eventos son excluyentes.
- **Creer que requiere independencia.** Es al revés: su utilidad está en que no la necesita.

:::figura[Sesenta personas: la suma de las 1770 probabilidades vale 4.85, absurda como probabilidad, mientras que la probabilidad exacta de una coincidencia es 0.994.]{componente="InequalityBound"}
```yaml
modo: union
personas: 60
```
:::

## Conexiones

La cota de la unión se deduce de la [[probabilidad-de-la-union-de-eventos]] y de los [[axiomas-de-kolmogorov]]. Su ejemplo clásico es la [[paradoja-del-cumpleanos]]. Combinada con cotas exponenciales para un solo evento, como la [[desigualdad-de-hoeffding]], da garantías simultáneas para muchos eventos a la vez. Es la herramienta básica de los [[lemas-de-borel-cantelli]].

## Formulario

:::formula[Cota de la unión]
$$
P\Big(\bigcup_{i=1}^{m} A_i\Big) \le \sum_{i=1}^{m} P(A_i)
$$

- $A_1, \dots, A_m$: eventos cualesquiera, sin supuestos de independencia; $m$: número de eventos.
- $\bigcup_i A_i$: el evento "ocurre al menos uno"; $P(A_i)$: probabilidad de cada evento.
:::

:::formula[Cota inferior de Bonferroni]
$$
\sum_{i=1}^{m} P(A_i) - \sum_{i < j} P(A_i \cap A_j) \le P\Big(\bigcup_{i=1}^{m} A_i\Big)
$$

- $A_i \cap A_j$: ocurren los dos eventos; $\sum_{i < j}$: suma sobre todas las parejas de eventos distintos.
:::

:::formula[Cumpleaños]
$$
P(\text{alguna coincidencia}) \le \binom{n}{2}\frac{1}{d}
$$

- $n$: número de personas; $d$: número de fechas, igualmente probables.
- $\binom{n}{2} = n(n - 1)/2$: número de parejas.
:::

:::formula[Corrección de Bonferroni]
$$
P(\text{algún falso positivo}) \le m \cdot \frac{\alpha}{m} = \alpha
$$

- $m$: número de pruebas, cada una con nivel $\alpha/m$; $\alpha$: nivel global deseado.
:::
