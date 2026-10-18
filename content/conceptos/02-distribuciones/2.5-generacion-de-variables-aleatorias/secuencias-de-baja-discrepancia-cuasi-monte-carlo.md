---
id: secuencias-de-baja-discrepancia-cuasi-monte-carlo
titulo: Secuencias de baja discrepancia (cuasi Monte Carlo)
titulo_en: Low-discrepancy sequences (quasi-Monte Carlo)
alias:
  - cuasi Monte Carlo
  - sucesión de Halton
  - sucesión de Sobol
  - van der Corput
modulo: 2
submodulo: '2.5'
orden: 11
nivel: avanzado
prerrequisitos:
  - generadores-de-numeros-pseudoaleatorios
relaciones:
  - tipo: contrasta
    id: generadores-de-numeros-pseudoaleatorios
etiquetas:
  - integración numérica
  - discrepancia
  - Halton
  - Monte Carlo
  - convergencia
resumen: >
  Sucesiones deterministas que llenan el cubo unitario de forma más pareja que los puntos al azar. Usadas
  para integrar, reducen el error de orden 1/√n del Monte Carlo a casi 1/n.
formula: 'D_n^{*} = \sup_{\mathbf{a}}\left|\frac{\#\{i \le n : \mathbf{x}_i \in [\mathbf{0}, \mathbf{a})\}}{n} - \prod_{j} a_j\right|, \qquad \left|\frac{1}{n}\sum_i f(\mathbf{x}_i) - \int f\right| \le V(f)\,D_n^{*}'
visualizacion:
  componente: RandomLab
  parametros:
    modo: baja-discrepancia
    valores:
      n: 64
      semilla: 3
    casos:
      - nombre: 'Pocos puntos'
        descripcion: '64 puntos: los aleatorios dejan huecos y grumos, los de Halton se reparten casi como una rejilla; la discrepancia es 0.18 contra 0.04.'
        valores: {n: 64, semilla: 3}
      - nombre: 'Muchos puntos'
        descripcion: '1024 puntos: la discrepancia de Halton baja a 0.004 y la de los aleatorios solo a 0.027.'
        valores: {n: 1024, semilla: 3}
      - nombre: 'Otra semilla'
        descripcion: 'Con otra semilla los puntos aleatorios cambian y su discrepancia también; la de Halton es la misma porque la sucesión es fija.'
        valores: {n: 64, semilla: 17}
referencias:
  - clave: murphy
publicado: true
---

## Intuición

Para estimar el área de un cuarto de círculo con el método de Monte Carlo se lanzan puntos al azar en el cuadrado unitario y se cuenta qué fracción cae dentro. El azar hace su trabajo, pero de manera desordenada: algunas zonas reciben puntos de más y otras quedan vacías, y el error baja lentamente, como $1/\sqrt{n}$. Para dividir el error entre diez hacen falta cien veces más puntos.

Si el objetivo es integrar, no hace falta que los puntos parezcan aleatorios: basta que cubran el cuadrado de manera pareja. Las secuencias de baja discrepancia hacen exactamente eso. Cada punto nuevo se coloca en el hueco más grande que dejan los anteriores, de modo que, en cualquier momento, la fracción de puntos en cualquier rectángulo se parece mucho a su área. La sucesión de Halton, por ejemplo, invierte los dígitos de $1, 2, 3, \dots$ escritos en base 2 para una coordenada y en base 3 para la otra.

Con estos puntos, el error de una integral baja casi como $1/n$: para dividirlo entre diez basta con unas diez veces más puntos. La ganancia es grande en pocas dimensiones y se reduce a medida que crece la dimensión.

## Definición

:::definicion[Discrepancia estrella]
Para puntos $\mathbf{x}_1, \dots, \mathbf{x}_n$ en $[0, 1)^{d}$, la **discrepancia estrella** es
$$
D_n^{*} = \sup_{\mathbf{a} \in [0, 1]^{d}}\left|\frac{\#\{i \le n : \mathbf{x}_i \in [\mathbf{0}, \mathbf{a})\}}{n} - \prod_{j=1}^{d} a_j\right|.
$$
Una sucesión es de **baja discrepancia** si $D_n^{*} = O\!\big((\log n)^{d}/n\big)$.
:::

:::definicion[Sucesión de Halton]
El **inverso radical** de $i$ en base $b$, con $i = \sum_k d_k b^{k}$, es $\phi_b(i) = \sum_k d_k b^{-k-1}$. La sucesión de Halton en dimensión $d$ usa bases primas distintas: $\mathbf{x}_i = (\phi_2(i), \phi_3(i), \dots)$.
:::

:::teorema[Koksma-Hlawka]
Si $f$ tiene variación acotada $V(f)$ en el sentido de Hardy y Krause,
$$
\left|\frac{1}{n}\sum_{i=1}^{n} f(\mathbf{x}_i) - \int_{[0,1]^{d}} f(\mathbf{x})\,d\mathbf{x}\right| \le V(f)\,D_n^{*}.
$$
:::

:::nota[Qué es X]
$\mathbf{x}_i$ = el punto $i$ de la sucesión en el cubo unitario, usado como nodo de integración en lugar de un punto al azar.
:::

:::nota[Qué hace cada parámetro]
- **$n$, número de puntos:** cuántos nodos se usan. Si aumenta, la discrepancia de Halton baja casi como $1/n$ y la de los puntos aleatorios como $1/\sqrt{n}$.
- **Semilla:** solo afecta a los puntos aleatorios; la sucesión de Halton es fija.
:::

:::nota[Qué significa cada símbolo]
- $D_n^{*}$: discrepancia estrella; $\mathbf{a}$: esquina de una caja anclada en el origen.
- $\#\{\cdot\}$: número de puntos que cumplen la condición; $\prod_j a_j$: volumen de la caja.
- $d$: dimensión; $b$: base; $d_k$: dígitos de $i$ en base $b$; $\phi_b$: inverso radical.
- $f$: función que se integra; $V(f)$: su variación.
:::

## Cómo usar la visualización

Los dos paneles muestran los mismos $n$ puntos: a la izquierda pseudoaleatorios del Mersenne Twister y a la derecha de la sucesión de Halton, con el arco del cuarto de círculo. Cada paso de la reproducción agrega un punto a cada panel. El panel de lecturas da la discrepancia aproximada de cada conjunto y el error al estimar $\pi$ como cuatro veces la fracción dentro del arco. Los casos cargan pocos puntos, muchos puntos y otra semilla.

Con 64 puntos observa los huecos de los aleatorios y la regularidad de Halton. Reproduce y observa que cada punto nuevo de Halton cae en un hueco. Pasa a 1024 y compara los errores de $\pi$.

## Ejemplo

Se estima $\pi$ con el cuarto de círculo usando puntos aleatorios y la sucesión de Halton en bases 2 y 3.

1. Los primeros puntos de Halton son $(0.5, 0.333)$, $(0.25, 0.667)$, $(0.75, 0.111)$, $(0.125, 0.444)$ y $(0.625, 0.778)$: cada uno llena un hueco de los anteriores.
2. Con 64 puntos, la discrepancia aproximada es 0.040 para Halton y 0.184 para los aleatorios con semilla 3.
3. Las estimaciones de $\pi$ son 3.1875 con Halton (error 0.046) y 3.375 con los aleatorios (error 0.233).
4. Con 1024 puntos, las discrepancias bajan a 0.0039 y 0.0273, y las estimaciones son 3.1484 (error 0.007) y 3.1563 (error 0.015).
5. Multiplicar los puntos por 16 redujo la discrepancia de Halton unas 10 veces y la de los aleatorios unas 7 veces; el error de una sola corrida aleatoria varía mucho por azar.

:::figura[Pocos puntos: con 64 puntos los aleatorios dejan huecos y grumos y los de Halton cubren el cuadrado casi como una rejilla.]{componente="RandomLab"}
```yaml
modo: baja-discrepancia
valores:
  n: 64
  semilla: 3
```
:::

## Propiedades

- **Tasa de error:** cuasi Monte Carlo logra $O((\log n)^{d}/n)$ frente a $O(1/\sqrt{n})$ del Monte Carlo para funciones suaves.
- **Determinismo:** no hay azar, así que no hay un error estándar; para estimar el error se usan versiones aleatorizadas, como el desplazamiento aleatorio de Cranley y Patterson.
- **Dimensión:** el factor $(\log n)^{d}$ crece con $d$; en dimensiones altas la ventaja depende de que la función tenga pocas direcciones importantes.
- **Halton en alta dimensión:** con bases primas grandes sus coordenadas están correlacionadas; en la práctica se prefieren las sucesiones de Sobol o Halton aleatorizadas.
- **No sirven para simular procesos aleatorios:** la regularidad que las hace buenas para integrar es una dependencia que arruinaría una simulación que necesite independencia.

:::figura[Casos con contexto (pocos puntos, muchos puntos, otra semilla): cada botón carga n y la semilla, y una frase compara las dos discrepancias.]{componente="RandomLab"}
```yaml
modo: baja-discrepancia
valores:
  n: 1024
  semilla: 3
casos:
  - nombre: 'Pocos puntos'
    descripcion: 'Discrepancia 0.18 contra 0.04.'
    valores: {n: 64, semilla: 3}
  - nombre: 'Muchos puntos'
    descripcion: '0.027 contra 0.004.'
    valores: {n: 1024, semilla: 3}
  - nombre: 'Otra semilla'
    descripcion: 'Solo cambian los aleatorios.'
    valores: {n: 64, semilla: 17}
```
:::

## Errores comunes

- **Usarlas como generador de números aleatorios.** Los puntos consecutivos de Halton están muy correlacionados; en una simulación de colas, por ejemplo, producirían llegadas con patrones.
- **Reportar un error estándar con una sola sucesión fija.** Sin aleatorización no hay variabilidad que medir; se aleatoriza la sucesión y se repite.
- **Esperar la misma ventaja en cualquier dimensión.** Con decenas de dimensiones y funciones irregulares, la ganancia puede desaparecer.
- **Truncar las primeras coordenadas sin cuidado.** Empezar la sucesión en el índice 0 da el punto $(0, 0)$; se suele empezar en 1 o descartar los primeros términos.

:::figura[Correlación entre puntos consecutivos: con solo 16 puntos se ve que Halton los coloca en un orden sistemático, sin nada de azar.]{componente="RandomLab"}
```yaml
modo: baja-discrepancia
valores:
  n: 16
  semilla: 3
```
:::

## Conexiones

Son una alternativa a los [[generadores-de-numeros-pseudoaleatorios]] para integrar, no para simular. La integral que aproximan es una [[integral-definida-como-area]] en varias dimensiones, y su buena distribución recuerda a la [[distribucion-uniforme-continua]] sin el ruido del azar. A diferencia del [[generador-congruencial-lineal]], cuya estructura regular es un defecto, aquí la regularidad es el objetivo. El [[metodo-de-monte-carlo-para-conteo-aproximado]] es la versión aleatoria de la misma idea. El [[mapa-de-relaciones-entre-distribuciones]] reúne las distribuciones del módulo.

## Formulario

:::formula[Discrepancia estrella]
$$
D_n^{*} = \sup_{\mathbf{a}}\left|\frac{\#\{i \le n : \mathbf{x}_i \in [\mathbf{0}, \mathbf{a})\}}{n} - \prod_{j=1}^{d} a_j\right|
$$

- $\mathbf{x}_i$: puntos; $\mathbf{a}$: esquina de la caja; $d$: dimensión.
:::

:::formula[Inverso radical]
$$
i = \sum_k d_k b^{k} \;\Rightarrow\; \phi_b(i) = \sum_k d_k b^{-k-1}
$$

- $b$: base; $d_k$: dígitos de $i$.
:::

:::formula[Koksma-Hlawka]
$$
\left|\frac{1}{n}\sum_{i=1}^{n} f(\mathbf{x}_i) - \int f\right| \le V(f)\,D_n^{*}
$$

- $f$: integrando; $V(f)$: variación de Hardy y Krause.
:::

:::formula[Tasas de error]
$$
\text{Monte Carlo: } O\!\left(\frac{1}{\sqrt{n}}\right), \qquad \text{cuasi Monte Carlo: } O\!\left(\frac{(\log n)^{d}}{n}\right)
$$

- $n$: número de puntos; $d$: dimensión.
:::
